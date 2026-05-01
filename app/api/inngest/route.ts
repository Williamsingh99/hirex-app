export const dynamic = 'force-dynamic';

// Inngest background jobs - temporarily disabled due to library compatibility
// To enable: npm install inngest@latest and uncomment code

export async function GET() {
  return Response.json({ 
    message: 'Inngest endpoint - currently disabled',
    status: 'inactive'
  });
}

export async function POST() {
  return Response.json({ 
    message: 'Inngest endpoint - currently disabled',
    status: 'inactive'
  });
}
