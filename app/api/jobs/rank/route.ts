import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
});

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    const supabase = await createClient();

    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch user's active resume and profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('parsed_data, raw_text')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'No active resume found' }, { status: 404 });
    }

    // 3. Fetch unmatched jobs (last 7 days)
    const { data: jobs, error: jobsError } = await supabase
      .from('job_listings')
      .select('*')
      .eq('created_at', `gte.${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`)
      .not('id', 'in', (
        await supabase
          .from('job_matches')
          .select('job_id')
          .eq('user_id', user.id)
      ).data?.map(m => m.job_id) || []);

    if (jobsError) throw jobsError;
    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ matched: 0, high_matches: 0, message: 'No new jobs to rank' });
    }

    // 4. Batch rank jobs with GPT-4o
    const BATCH_SIZE = 10;
    const matchResults = [];

    for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
      const batch = jobs.slice(i, i + BATCH_SIZE);

      const prompt = `You are a job matching AI. Given a candidate profile and a list of job descriptions, calculate a match score for each job.

Candidate Profile:
- Headline: ${profile.headline}
- Target Role: ${profile.target_role}
- Experience: ${profile.years_experience} years
- Preferred Locations: ${profile.preferred_locations?.join(', ')}
- Salary Expectation: ${profile.target_salary_min}-${profile.target_salary_max} ${profile.target_salary_max ? 'INR' : ''}

Resume Data:
${JSON.stringify(resume.parsed_data)}

Jobs to Rank:
${batch.map((j, idx) => `Job ${idx + 1}: ${j.title} at ${j.company}\nDescription: ${j.description}`).join('\n\n')}

For each job, return a JSON object with:
- job_id: The UUID of the job
- match_score: 0-100 AI semantic score
- skill_match_pct: 0-100
- experience_match: boolean
- salary_match: boolean
- location_match: boolean
- missing_skills: string[]
- match_reason: string (max 15 words explaining why it's a match)

Return ONLY a JSON array. No markdown.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const parsedBatch = JSON.parse(completion.choices[0].message.content || '{}');
      const results = Array.isArray(parsedBatch) ? parsedBatch : (parsedBatch.matches || []);
      matchResults.push(...results);
    }

    // 5. Insert match results into database
    const { error: insertError } = await supabase
      .from('job_matches')
      .upsert(
        matchResults.map(res => ({
          user_id: user.id,
          job_id: res.job_id,
          match_score: res.match_score,
          skill_match_pct: res.skill_match_pct,
          experience_match: res.experience_match,
          salary_match: res.salary_match,
          location_match: res.location_match,
          missing_skills: res.missing_skills,
          match_reason: res.match_reason,
          status: 'pending'
        }))
      );

    if (insertError) throw insertError;

    const highMatches = matchResults.filter(r => r.match_score >= 80).length;

    return NextResponse.json({
      matched: matchResults.length,
      high_matches: highMatches
    });
  } catch (error: any) {
    console.error('Ranking error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
