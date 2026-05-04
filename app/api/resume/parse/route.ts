import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import OpenAI from 'openai';
import { RESUME_PARSE_PROMPT } from '@/lib/ai/prompts';
import { NVIDIA_AI_CONFIG } from '@/lib/ai-config';
import { cleanResumeText } from '@/lib/resume/text-utils';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || 'dummy_key_for_build',
  baseURL: NVIDIA_AI_CONFIG.baseURL,
});

export async function POST(req: Request) {
  try {
    const { resume_id } = await req.json();
    const supabase = await createClient();

    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch resume metadata
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('file_url, user_id')
      .eq('id', resume_id)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (resume.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Download PDF and extract text
    const response = await fetch(resume.file_url);
    if (!response.ok) throw new Error('Failed to download PDF');
    const buffer = await response.arrayBuffer();
    const pdfData = await pdf(Buffer.from(buffer));
    const rawText = pdfData.text;
    const cleanedText = cleanResumeText(rawText);

    // 4. AI Parsing via NVIDIA NIM
    const completion = await openai.chat.completions.create({
      model: NVIDIA_AI_CONFIG.model,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: RESUME_PARSE_PROMPT },
        { role: 'user', content: `Resume Text:\n${cleanedText}\n\nPlease output the pure JSON now.` }
      ],
    });

    const content = completion.choices[0]?.message?.content || '{}';
    
    // Extract JSON from markdown blocks if present
    const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    
    const parsedData = JSON.parse(jsonString);

    // 5. Update database
    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        raw_text: rawText,
        parsed_data: parsedData,
      })
      .eq('id', resume_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, parsed_data: parsedData });
  } catch (error: any) {
    console.error('Parse error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
