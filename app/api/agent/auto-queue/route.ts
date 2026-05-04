import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { NVIDIA_AI_CONFIG } from '@/lib/ai-config';
import { revalidatePath } from 'next/cache';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || 'dummy_key_for_build',
  baseURL: NVIDIA_AI_CONFIG.baseURL,
});

interface AIResponse {
  match_score: number;
  evaluation: string;
  cover_letter: string;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Session Validation
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Active Resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('id, raw_text, parsed_data')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'No active resume found. Please set a primary resume first.' }, { status: 400 });
    }

    // 3. Fetch Pending Jobs
    // Find jobs that the user hasn't interacted with yet
    const { data: pendingJobs, error: jobsError } = await supabase
      .from('job_listings')
      .select('id, title, company, description')
      .not('id', 'in', (
        await supabase
          .from('applications')
          .select('job_id')
          .eq('user_id', user.id)
      ).data?.map(a => a.job_id) || [])
      .limit(5);

    if (jobsError) throw jobsError;
    if (!pendingJobs || pendingJobs.length === 0) {
      return NextResponse.json({
        success: true,
        evaluated: 0,
        applied: 0,
        message: 'No new jobs to evaluate.'
      });
    }

    let appliedCount = 0;
    const results_summary = [];

    // 4. AI Evaluation Loop (Parallelized)
    const evaluationPromises = pendingJobs.map(async (job) => {
      try {
        const prompt = `You are an expert technical recruiter. Evaluate the fit between the following resume and job description.

Job Title: ${job.title}
Company: ${job.company}
Job Description: ${job.description}

Resume Text:
${resume.raw_text}

Parsed Data:
${JSON.stringify(resume.parsed_data)}

Return ONLY a valid JSON object with the following structure:
{
  "match_score": number (0-100),
  "evaluation": "string (short a few sentences explaining the fit)",
  "cover_letter": "string (a tailored, highly professional cover letter if score >= 75, otherwise empty)"
}

Ensure the JSON is pure and contains no markdown blocks.`;

        const completion = await openai.chat.completions.create({
          model: NVIDIA_AI_CONFIG.model,
          messages: [
            { role: 'system', content: 'You are a precise AI agent that only outputs valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
        });

        const content = completion.choices[0]?.message?.content || '{}';
        const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;

        const aiResult: AIResponse = JSON.parse(jsonString);
        return { job, aiResult };
      } catch (e) {
        console.error(`AI evaluation failed for job ${job.id}:`, e);
        return { job, error: e };
      }
    });

    const results = await Promise.allSettled(evaluationPromises);

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value && !result.value.error) {
        const { job, aiResult } = result.value;

        if (!aiResult) continue;

        // 5. Database Operations based on score
        const status = aiResult.match_score >= 75 ? 'applied' : 'ignored';
        if (status === 'applied') appliedCount++;

        const { error: appError } = await supabase
          .from('applications')
          .insert({
            user_id: user.id,
            job_id: job.id,
            status: status,
            cover_letter: aiResult.cover_letter,
            applied_via: 'auto',
            applied_at: new Date().toISOString(),
            resume_id: resume.id
          });

        if (appError) console.error(`Error creating application for job ${job.id}:`, appError);

        results_summary.push({ jobId: job.id, score: aiResult.match_score, status });
      } else if (result.status === 'fulfilled' && result.value?.error) {
        console.error(`Evaluation skipped for job ${result.value.job.id} due to AI error`);
      }
    }

    revalidatePath('/dashboard');

    return NextResponse.json({
      success: true,
      evaluated: pendingJobs.length,
      applied: appliedCount,
      details: results_summary
    });

  } catch (error: any) {
    console.error('Auto-Queue error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
