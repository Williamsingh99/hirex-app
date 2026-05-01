// @ts-nocheck
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
// bebity/linkedin-jobs-scraper — popular, well-maintained actor
const ACTOR_ID = 'bebity~linkedin-jobs-scraper';

export async function POST(req: Request) {
  try {
    if (!APIFY_API_TOKEN) {
      return NextResponse.json(
        { error: 'APIFY_API_TOKEN not configured. Please add it to your environment variables.' },
        { status: 500 }
      );
    }

    const { keywords, location, maxJobs = 20 } = await req.json();

    if (!keywords) {
      return NextResponse.json({ error: 'keywords is required (e.g. "React Developer")' }, { status: 400 });
    }

    console.log(`[APIFY_SYNC] Starting LinkedIn Jobs scrape for: "${keywords}" in "${location || 'Anywhere'}"`);

    // Step 1: Start the Apify Actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: keywords,
          location: location || '',
          rows: maxJobs,
          proxy: {
            useApifyProxy: true,
          },
        }),
      }
    );

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      throw new Error(`Apify run failed: ${runResponse.status} — ${errorText}`);
    }

    const runData = await runResponse.json();
    const runId = runData?.data?.id;

    if (!runId) {
      throw new Error('Apify did not return a run ID');
    }

    console.log(`[APIFY_SYNC] Run started. Run ID: ${runId}`);

    // Step 2: Wait for the run to finish (poll every 5s, max 3 minutes)
    let runStatus = 'RUNNING';
    let attempts = 0;
    const maxAttempts = 36; // 36 * 5s = 3 minutes

    while (runStatus === 'RUNNING' || runStatus === 'READY') {
      if (attempts >= maxAttempts) {
        throw new Error('Apify run timed out after 3 minutes');
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const statusRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`
      );
      const statusData = await statusRes.json();
      runStatus = statusData?.data?.status;
      attempts++;
      console.log(`[APIFY_SYNC] Attempt ${attempts}: Status = ${runStatus}`);
    }

    if (runStatus !== 'SUCCEEDED') {
      throw new Error(`Apify run did not succeed. Final status: ${runStatus}`);
    }

    // Step 3: Fetch dataset results
    const datasetId = runData?.data?.defaultDatasetId;
    const dataRes = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}&format=json&limit=${maxJobs}`
    );
    const rawJobs: any[] = await dataRes.json();

    console.log(`[APIFY_SYNC] Fetched ${rawJobs.length} raw jobs from Apify`);

    if (!rawJobs || rawJobs.length === 0) {
      return NextResponse.json({ message: 'No jobs found for this query', inserted: 0 });
    }

    // Step 4: Transform and upsert into Supabase jobs table
    const supabase = await createClient();

    const jobsToUpsert = rawJobs
      .filter((j) => j.title && j.companyName)
      .map((j) => ({
        portal_name: 'linkedin',
        portal_job_id: j.id || j.jobId || `linkedin-${Date.now()}-${Math.random()}`,
        title: j.title || 'Untitled',
        company: j.companyName || 'Unknown Company',
        location: j.location || null,
        is_remote: j.workType?.toLowerCase().includes('remote') || false,
        salary_min: null,
        salary_max: null,
        currency: 'USD',
        description: j.description || j.descriptionText || null,
        required_skills: [],
        experience_required: j.experienceLevel || null,
        employment_type: j.contractType || j.employmentType || null,
        posted_at: j.postedAt ? new Date(j.postedAt).toISOString() : null,
        apply_url: j.applyUrl || j.linkedInUrl || null,
      }));

    const { data: inserted, error: upsertError } = await supabase
      .from('jobs')
      .upsert(jobsToUpsert, { onConflict: 'portal_name,portal_job_id' })
      .select('id');

    if (upsertError) {
      console.error('[APIFY_SYNC] Supabase upsert error:', upsertError);
      throw new Error(`Database error: ${upsertError.message}`);
    }

    console.log(`[APIFY_SYNC] Successfully upserted ${inserted?.length || 0} jobs into Supabase`);

    return NextResponse.json({
      success: true,
      message: `Synced ${inserted?.length || 0} jobs from LinkedIn via Apify`,
      inserted: inserted?.length || 0,
      keywords,
      location: location || 'Any',
    });
  } catch (error: any) {
    console.error('[APIFY_SYNC_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
