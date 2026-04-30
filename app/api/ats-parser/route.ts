import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { NVIDIA_AI_CONFIG } from '@/lib/ai-config';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: NVIDIA_AI_CONFIG.baseURL,
});

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Resume text and job description are required' }, { status: 400 });
    }

    const prompt = `
      You are an expert Technical Recruiter and ATS (Applicant Tracking System) analyzer.
      Analyze the following resume against the provided job description.

      RESUME:
      ${resumeText}

      JOB DESCRIPTION:
      ${jobDescription}

      Return the analysis strictly as a JSON object with the following keys:
      - match_score: (number 0-100) reflecting how well the candidate fits the role.
      - missing_skills: (array of strings) key skills from the JD not found in the resume.
      - suggested_improvements: (array of strings) actionable tips to improve the resume for this specific role.
      - summary: (string) a brief 2-sentence explanation of the match score.

      Ensure the output is valid JSON.
    `;

    const response = await openai.chat.completions.create({
      model: NVIDIA_AI_CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('AI returned empty response');

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error('[ATS_PARSER_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
