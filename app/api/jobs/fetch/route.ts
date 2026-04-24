import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { fetchLinkedInJobs, fetchIndeedJobs, fetchNaukriJobs } from '@/lib/portals';

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    const supabase = await createClient();

    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get user's connected portals and profile
    const { data: connections, error: connError } = await supabase
      .from('portal_connections')
      .select('*')
      .eq('user_id', user.id);

    if (connError) throw connError;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // 3. Fetch jobs from all connected portals
    const allJobs = [];
    for (const conn of connections || []) {
      const portal = conn.portal;
      const token = conn.access_token || conn.refresh_token;

      if (portal === 'linkedin') {
        const jobs = await fetchLinkedInJobs(token, profile);
        allJobs.push(...jobs);
      } else if (portal === 'indeed') {
        const jobs = await fetchIndeedJobs(token, profile);
        allJobs.push(...jobs);
      } else if (portal === 'naukri') {
        const jobs = await fetchNaukriJobs(conn.portal_user_id, profile);
        allJobs.push(...jobs);
      }
    }

    // 4. Upsert jobs into the database
    // We use portal_job_id + portal as a unique constraint
    const { error: upsertError } = await supabase
      .from('job_listings')
      .upsert(allJobs, { onConflict: 'portal,portal_job_id' });

    if (upsertError) throw upsertError;

    return NextResponse.json({
      success: true,
      synced: allJobs.length
    });
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
