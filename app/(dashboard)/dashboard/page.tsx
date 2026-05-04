import { createClient } from '@/lib/supabase/server';
import { getCachedDashboardData } from '@/lib/dashboard/data';
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Fetch User Session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/');
  }

  // 2. Fetch Applications and Job data
  const applications = await getCachedDashboardData(user.id);

  // 3. Calculate Stats
  const totalApplied = applications?.length || 0;
  const interviews = applications?.filter(a => a.status === 'interview').length || 0;
  const offers = applications?.filter(a => a.status === 'offer').length || 0;

  // Map data for the Tracker component
  const trackerData = applications?.map(app => ({
    applications: app,
    jobs: app.jobs
  })) || [];

  return (
    <DashboardClient
      initialStats={{
        total_applied: totalApplied,
        applied_today: 0,
        interviews_scheduled: interviews,
        offers_received: offers,
        unread_messages: 0,
        ats_score: 92,
        match_rate: 94,
        portals_connected: 2
      }}
      initialApplications={trackerData}
    />
  );
}
