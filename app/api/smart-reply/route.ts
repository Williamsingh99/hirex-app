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

      Return the results strictly as a JSON object:
      {
        "drafts": [
          { "type": "Professional", "content": "..." },
          { "type": "Enthusiastic", "content": "..." },
          { "type": "Strategic", "content": "..." }
        ]
      }

      Ensure the output is valid JSON.
    `;

    const response = await openai.chat.completions.create({
      model: NVIDIA_AI_CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('AI returned empty response');

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error('[SMART_REPLY_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
