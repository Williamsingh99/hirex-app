import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { resume_id, job_description } = await req.json();
    const supabase = await createClient();

    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch resume data
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('raw_text, parsed_data, user_id')
      .eq('id', resume_id)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (resume.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. AI Optimization via GPT-4o
    const context = job_description
      ? `Analyze this resume against the following job description: ${job_description}`
      : 'Analyze this resume against general professional best practices and ATS standards';

    const prompt = `You are an expert ATS resume optimizer with 15 years experience helping candidates beat Applicant Tracking Systems.

${context}

Resume Text:
${resume.raw_text}

Parsed Data:
${JSON.stringify(resume.parsed_data)}

Analyze and:
1. Calculate an ATS score from 0-100 based on:
   - Keyword density (30 points)
   - Bullet point strength with metrics (25 points)
   - Format compliance (20 points)
   - Skills section completeness (15 points)
   - Contact info completeness (10 points)

2. Identify ALL issues as an array of:
   { "type": "missing_keyword" | "weak_bullet" | "format_issue" | "length_issue", "severity": "high"|"medium"|"low", "description": "string", "suggestion": "string", "original": "string", "improved": "string" }

3. Rewrite every weak bullet point using the STAR format (Situation, Task, Action, Result) with quantified achievements.
   Example: 'Worked on React applications' -> 'Architected and shipped 6 React applications serving 50K+ users, reducing load time by 40% through code splitting'

4. Add missing industry keywords naturally into the summary section.

Return ONLY valid JSON:
{
  "ats_score": number,
  "ats_issues": [],
  "optimized_text": "string",
  "improvements_count": number,
  "keywords_added": ["string"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // 4. Update database
    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        ats_score: result.ats_score,
        ats_issues: result.ats_issues,
        optimized_text: result.optimized_text,
      })
      .eq('id', resume_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
