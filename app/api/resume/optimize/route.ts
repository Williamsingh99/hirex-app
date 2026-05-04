import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { RESUME_OPTIMIZE_PROMPT } from '@/lib/ai/prompts';
import { NVIDIA_AI_CONFIG } from '@/lib/ai-config';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || 'dummy_key_for_build',
  baseURL: NVIDIA_AI_CONFIG.baseURL,
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

    // 3. AI Optimization via NVIDIA NIM
    const systemPrompt = RESUME_OPTIMIZE_PROMPT(job_description, resume.raw_text, resume.parsed_data);

    const completion = await openai.chat.completions.create({
      model: NVIDIA_AI_CONFIG.model,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please optimize this resume according to the provided instructions and output the pure JSON.' }
      ],
    });

    const content = completion.choices[0]?.message?.content || '{}';
    
    // Extract JSON from markdown blocks if present
    const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    
    const result = JSON.parse(jsonString);

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
