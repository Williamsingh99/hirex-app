import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getGmailClient, searchRecruiterEmails, getMessageDetails } from '@/lib/gmail';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    // 2. Get Gmail access token from portal connections
    const { data: connection, error: connError } = await supabase
      .from('portal_connections')
      .select('access_token')
      .eq('user_id', user.id)
      .eq('portal', 'gmail')
      .single();

    if (connError || !connection) {
      return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 });
    }

    const gmail = await getGmailClient(connection.access_token);

    // 3. Fetch relevant recruiter emails
    const messages = await searchRecruiterEmails(gmail);

    const syncResults = [];

    for (const msg of messages) {
      const details = await getMessageDetails(gmail, msg.id);

      // 4. Classify email with GPT-4o
      const classificationPrompt = `Classify this recruiter email:
        Subject: ${details.subject}
        Body: ${details.snippet}

        Return ONLY JSON:
        {
          "message_type": "interview_invite" | "rejection" | "offer" | "general",
          "ai_summary": "string (max 12 words)",
          "sender_company": "string (extract company name)",
          "suggested_reply": "string (50 words, professional, warm)"
        }`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: classificationPrompt }],
        response_format: { type: 'json_object' },
      });

      const classification = JSON.parse(completion.choices[0].message.content || '{}');

      // 5. Upsert into recruiter_messages table
      const { error: upsertError } = await supabase
        .from('recruiter_messages')
        .upsert({
          user_id: user.id,
          portal: 'gmail',
          message_id: details.id,
          sender_name: details.from,
          subject: details.subject,
          body: details.body,
          message_type: classification.message_type,
          ai_summary: classification.ai_summary,
          suggested_reply: classification.suggested_reply,
          sender_company: classification.sender_company,
        }, { onConflict: 'message_id' });

      if (upsertError) throw upsertError;
      syncResults.push(details.id);
    }

    return NextResponse.json({
      synced: syncResults.length,
      new_messages: syncResults.length,
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
