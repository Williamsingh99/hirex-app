import { createClient } from '@/lib/supabase/server';

export interface UsageLimits {
  free: {
    applications: number;
    portal_connections: number;
    ai_queries: number;
    resume_uploads: number;
  };
  pro: {
    applications: number;
    portal_connections: number;
    ai_queries: number;
    resume_uploads: number;
  };
  enterprise: {
    applications: number;
    portal_connections: number;
    ai_queries: number;
    resume_uploads: number;
  };
}

export const USAGE_LIMITS: UsageLimits = {
  free: {
    applications: 10,
    portal_connections: 1,
    ai_queries: 20,
    resume_uploads: 3,
  },
  pro: {
    applications: 999999, // unlimited
    portal_connections: 5,
    ai_queries: 999999,
    resume_uploads: 999999,
  },
  enterprise: {
    applications: 999999,
    portal_connections: 999999,
    ai_queries: 999999,
    resume_uploads: 999999,
  },
};

export async function checkUsageLimit(feature: keyof typeof USAGE_LIMITS.free) {
  const supabase = await createClient();

  // Get user's plan
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = (profile?.plan as keyof UsageLimits) || 'free';
  const limit = USAGE_LIMITS[plan][feature];

  // Check current usage
  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('used_count, limit_count')
    .eq('user_id', user.id)
    .eq('feature', feature)
    .gte('period_start', new Date().toISOString().split('T')[0])
    .lte('period_end', new Date().toISOString().split('T')[0])
    .single();

  const currentUsage = usage?.used_count || 0;

  return {
    allowed: currentUsage < limit,
    current: currentUsage,
    limit,
    remaining: Math.max(0, limit - currentUsage),
    plan,
  };
}

export async function incrementUsage(feature: keyof typeof USAGE_LIMITS.free, count = 1) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = (profile?.plan as keyof UsageLimits) || 'free';
  const limit = USAGE_LIMITS[plan][feature];

  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  // Upsert usage record
  const { error } = await supabase
    .from('usage_tracking')
    .upsert({
      user_id: user.id,
      feature,
      used_count: count,
      limit_count: limit,
      period_start: today,
      period_end: nextMonth.toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,feature,period_start',
    });

  if (error) throw error;
}

export async function getUsageDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', user.id)
    .gte('period_start', new Date().toISOString().split('T')[0])
    .lte('period_end', new Date().toISOString().split('T')[0]);

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = (profile?.plan as keyof UsageLimits) || 'free';

  const dashboard = {
    plan,
    features: {} as Record<string, { used: number; limit: number; remaining: number }>,
  };

  const features = ['applications', 'portal_connections', 'ai_queries', 'resume_uploads'] as const;

  for (const feature of features) {
    const featureUsage = usage?.find(u => u.feature === feature);
    const limit = USAGE_LIMITS[plan][feature];
    const used = featureUsage?.used_count || 0;

    dashboard.features[feature] = {
      used,
      limit,
      remaining: Math.max(0, limit - used),
    };
  }

  return dashboard;
}
