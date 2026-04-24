import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
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

    // 4. AI Parsing via GPT-4o
    const prompt = `You are a resume parser. Extract all information from this resume text
      and return ONLY valid JSON matching this schema:
      {
        "name": "string",
        "email": "string",
        "phone": "string",
        "summary": "string",
        "skills": ["string"],
        "experience": [{
          "company": "string",
          "role": "string",
          "duration": "string",
          "bullets": ["string"]
        }],
        "education": [{
          "institution": "string",
          "degree": "string",
          "field": "string",
          "year": "string"
        }],
        "certifications": ["string"],
        "languages": ["string"]
      }
      No markdown. No explanation. Pure JSON only.

      Resume Text:
      ${rawText}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const parsedData = JSON.parse(completion.choices[0].message.content || '{}');

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
