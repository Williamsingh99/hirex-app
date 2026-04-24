import { google } from 'googleapis';

export async function getGmailClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.gmail({ version: 'v1', auth });
}

export async function searchRecruiterEmails(gmail: any) {
  const query = 'from:(naukri.com OR indeed.com OR linkedin.com) "interview" OR "application" OR "opportunity" OR "position" OR "role" OR "shortlisted" OR "selected" OR "regret" OR "offer letter" OR "congratulations"';

  const response = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 50,
  });

  return response.data.messages || [];
}

export async function getMessageDetails(gmail: any, messageId: string) {
  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  });

  const message = response.data;
  const payload = message.payload;

  // Extract snippet and body
  const snippet = message.snippet || '';
  let body = '';

  if (payload.parts && payload.parts[0].body.data) {
    body = Buffer.from(payload.parts[0].body.data, 'base64').toString();
  } else if (payload.body?.data) {
    body = Buffer.from(payload.body.data, 'base64').toString();
  }

  return {
    id: message.id,
    snippet,
    body,
    subject: payload.headers?.find((h: any) => h.name === 'Subject')?.value || 'No Subject',
    from: payload.headers?.find((h: any) => h.name === 'From')?.value || 'Unknown Sender',
  };
}
