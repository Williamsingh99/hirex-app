import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;

// apify/google-search-scraper — Official Apify actor, FREE with platform credits, no rent needed.
// We search Google Jobs (site:linkedin.com/jobs OR jobs.google.com) to get real job listings.
const ACTOR_ID = 'apify~google-search-scraper';

export async function POST(req: Request) {
  try {
    if (!APIFY_API_TOKEN) {
      return NextResponse.json(
        { error: 'APIFY_API_TOKEN not configured in environment variables.' },
        { status: 500 }
      );
    }

    const { keywords, location, maxJobs = 20 } = await req.json();

    if (!keywords) {
      return NextResponse.json({ error: 'keywords is required (e.g. "React Developer")' }, { status: 400 });
    }

    // Build a Google Jobs search query
    const locationPart = location ? ` ${location}` : '';
    const googleQuery = `${keywords}${locationPart} jobs site:linkedin.com/jobs`;

    console.log(`[JOBS_SYNC] Google Search query: "${googleQuery}"`);

    // Step 1: Start the Apify actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: googleQuery,
          maxPagesPerQuery: 2,        // 2 pages × ~10 results = ~20 jobs
          resultsPerPage: 10,
          languageCode: 'en',
          countryCode: 'us',
          customDataFunction: '',
        }),
      }
    );

    if (!runResponse.ok) {
      const errText = await runResponse.text();
      throw new Error(`Apify run failed: ${runResponse.status} — ${errText}`);
    }

    const runData = await runResponse.json();
    const runId = runData?.data?.id;
    const datasetId = runData?.data?.defaultDatasetId;

    if (!runId) throw new Error('Apify did not return a run ID');

    console.log(`[JOBS_SYNC] Run started. ID: ${runId}`);

    // Step 2: Poll for completion (max 3 min)
    let status = 'RUNNING';
    let attempts = 0;
    while ((status === 'RUNNING' || status === 'READY') && attempts < 36) {
      await new Promise((r) => setTimeout(r, 5000));
      const s = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`);
      status = (await s.json())?.data?.status;
      attempts++;
      console.log(`[JOBS_SYNC] Poll ${attempts}: ${status}`);
    }

    if (status !== 'SUCCEEDED') {
      throw new Error(`Apify run did not succeed. Final status: ${status}`);
    }

    // Step 3: Fetch search result items
    const dataRes = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}&format=json&limit=200`
    );
    const pages: any[] = await dataRes.json();

    // Flatten: each page has organicResults[]
    const results: any[] = [];
    for (const page of pages) {
      if (Array.isArray(page.organicResults)) {
        results.push(...page.organicResults);
      }
    }

    console.log(`[JOBS_SYNC] Got ${results.length} Google search results`);

    if (results.length === 0) {
      return NextResponse.json({ message: 'No jobs found for this query', inserted: 0 });
    }

    // Step 4: Map Google results → jobs table schema
    const supabase = await createClient();

    const jobsToUpsert = results
      .slice(0, maxJobs)
      .filter((r) => r.title && r.displayedUrl)
      .map((r, idx) => {
        // Extract company from description or displayedUrl
        const displayParts = (r.displayedUrl || '').split('›');
        const company = displayParts[1]?.trim() || 'Unknown Company';

        return {
          portal_name: 'linkedin',
          portal_job_id: `google-${Date.now()}-${idx}`,
          title: r.title?.replace(/ - .*/, '').trim() || 'Untitled',
          company,
          location: location || null,
          is_remote: keywords.toLowerCase().includes('remote') || (location || '').toLowerCase().includes('remote'),
          salary_min: null,
          salary_max: null,
          currency: 'USD',
          description: r.description || r.snippet || null,
          required_skills: [],
          experience_required: null,
          employment_type: null,
          posted_at: null,
          apply_url: r.url || null,
        };
      });

    const { data: inserted, error: upsertError } = await supabase
      .from('jobs')
      .insert(jobsToUpsert)   // insert (not upsert) since IDs are unique per run
      .select('id');

    if (upsertError) {
      console.error('[JOBS_SYNC] Supabase error:', upsertError);
      throw new Error(`Database error: ${upsertError.message}`);
    }

    console.log(`[JOBS_SYNC] Inserted ${inserted?.length || 0} jobs`);

    return NextResponse.json({
      success: true,
      message: `Synced ${inserted?.length || 0} jobs for "${keywords}"`,
      inserted: inserted?.length || 0,
      keywords,
      location: location || 'Any',
    });
  } catch (error: any) {
    console.error('[JOBS_SYNC_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

