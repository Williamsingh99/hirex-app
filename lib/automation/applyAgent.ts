import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { chromium } from 'playwright';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function applyToJob(userId: string, matchId: string) {
  const supabase = await createClient();

  // 1. Fetch Match and Job Details
  const { data: match, error: matchError } = await supabase
    .from('job_matches')
    .select('*, job(*)')
    .eq('id', matchId)
    .single();

  if (matchError || !match) throw new Error('Match not found');
  const job = match.job;

  // 2. Fetch User Profile and Active Resume
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: resume } = await supabase
    .from('resumes')
    .select('file_url')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (!profile || !resume) throw new Error('Profile or active resume missing');

  // 3. Generate AI Cover Letter
  const coverLetterPrompt = `Write a 150-word cover letter for ${job.title} at ${job.company}.
    Candidate: ${profile.full_name}, ${profile.headline}
    Top 3 matching skills: ${match.missing_skills?.length === 0 ? 'Perfect match' : match.missing_skills.join(', ')}
    Tone: Professional, confident, and specific to this company.
    Start with a strong hook. End with a clear call to action.
    No generic phrases like 'I am writing to express my interest'.
    Return ONLY the cover letter text.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'system', content: coverLetterPrompt }],
  });

  const coverLetter = completion.choices[0].message.content || '';

  // 4. Handle Portal-Specific Application Logic
  let applicationStatus = 'auto';

  if (job.portal === 'linkedin') {
    // API implementation (Mocked for this build stage)
    console.log(`[LinkedIn API] Applying with cover letter: ${coverLetter.substring(0, 50)}...`);
  } else if (job.portal === 'indeed') {
    // API implementation (Mocked for this build stage)
    console.log(`[Indeed API] Applying with cover letter: ${coverLetter.substring(0, 50)}...`);
  } else if (job.portal === 'naukri') {
    // Playwright Automation
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
      await page.goto(job.apply_url);
      // This is a simplified automation flow.
      // In prod, this would involve:
      // 1. Session management (cookie injection)
      // 2. Filling specific form fields based on the job portal's current DOM
      // 3L. Uploading the resume PDF from the resume.file_url
      await page.waitForSelector('input[type="file"]', { timeout: 5000 }).catch(() => {});
      await page.fill('input[name="name"]', profile.full_name);
      await page.fill('input[name="email"]', profile.email);
      await page.click('button[type="submit"]');
      await browser.close();
    } catch (e) {
      console.error(`[Naukri Automation] Error: ${e}`);
      await browser.close();
      throw e;
    }
  }

  // 5. Create Application Record
  const { error: appError } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      job_id: job.id,
      portal: job.portal,
      resume_id: resume.id,
      cover_letter: coverLetter,
      applied_via: 'auto',
      status: 'applied',
    });

  if (appError) throw appError;

  // 6. Update Job Match Status
  const { error: matchErrorUpdate } = await supabase
    .from('job_matches')
    .update({ status: 'applied' })
    .eq('id', matchId);

  if (matchErrorUpdate) throw matchErrorUpdate;

  return { success: true };
}
