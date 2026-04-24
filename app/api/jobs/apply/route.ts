import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { applyToJob } from '@/lib/automation/applyAgent';

export async function POST(req: Request) {
  try {
    const { job_match_id } = await req.json();
    const supabase = await createClient();

    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Trigger the automation agent
    const result = await applyToJob(user.id, job_match_id);

    return NextResponse.json({
      message: 'Application submitted successfully via AI Agent',
      ...result
    });
  } catch (error: any) {
    console.error('Apply error:', error);
    return NextResponse.json({
      error: error.message || 'Application failed during automation',
    }, { status: 500 });
  }
}
