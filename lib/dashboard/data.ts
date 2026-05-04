import { createClient } from '@/lib/supabase/server';

export async function getCachedDashboardData(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (*)
    `)
    .eq('user_id', userId)
    .order('applied_at', { ascending: false });

  if (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }

  return data;
}
