import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { NVIDIA_AI_CONFIG } from '@/lib/ai-config';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: NVIDIA_AI_CONFIG.baseURL,
});

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Recruiter message is required' }, { status: 400 });
    }

    const prompt = `
      You are a highly skilled Career Coach and Professional Communications Expert.
      Your task is to generate 3 distinct, high-conversion draft responses to a recruiter's message.

      RECRUITER MESSAGE:
      "${message}"

      CONTEXT:
      ${context || 'Generic job application follow-up'}

      Guidelines for responses:
      1. Option 1 (The Professional): Formal, polite, and structured.
      2. Option 2 (The Enthusiastic): Energetic, showing high interest and passion.
      3. Option 3 (The Strategic/Direct): Concise, value-driven, and focuses on scheduling.

      Each response must be professional, natural, and avoid typical "AI-sounding" clichés.

      Return the results strictly as a JSON object with this exact structure:
      {
        "drafts": [
          "[Professional reply text here]",
          "[Enthusiastic reply text here]",
          "[Strategic reply text here]"
        ]
      }

      The drafts array must contain exactly 3 plain strings. No nested objects. Ensure output is valid JSON.
    `;

    const response = await openai.chat.completions.create({
      model: NVIDIA_AI_CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('AI returned empty response');

    // Extract JSON even if model wraps it in markdown code blocks
    const jsonMatch = content.match(/{[\s\S]*}/); 
    if (!jsonMatch) throw new Error('AI did not return valid JSON');

    const parsed = JSON.parse(jsonMatch[0]);

    // Normalize: handle both string[] and {type,content}[] formats
    const rawDrafts = parsed.drafts || [];
    const drafts: string[] = rawDrafts.map((d: any) =>
      typeof d === 'string' ? d : d.content || JSON.stringify(d)
    );

    return NextResponse.json({ drafts });
  } catch (error: any) {
    console.error('[SMART_REPLY_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
