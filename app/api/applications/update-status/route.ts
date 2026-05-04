import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type ValidStatus = 'applied' | 'viewed' | 'shortlisted' | 'interview' | 'rejected' | 'offer';

export async function PATCH(req: Request) {
  try {
    const { application_id, status } = await req.json();
    const supabase = await createClient();

    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate status input
    const validStatuses: ValidStatus[] = ['applied', 'viewed', 'shortlisted', 'interview', 'rejected', 'offer'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // 3. Update and verify ownership
    const { data, error: updateError } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', application_id)
      .eq('user_id', user.id)
      .select();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Application not found or forbidden' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      application: data[0]
    });

  } catch (error: any) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
