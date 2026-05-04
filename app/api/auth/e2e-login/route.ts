import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Security Gate: Only enable this route if the E2E test flag is explicitly set
  if (process.env.NEXT_PUBLIC_IS_E2E_TEST !== 'true') {
    return new Response('Not found', { status: 404 });
  }

  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    // 2. Authenticate via Supabase Server Client
    // This will automatically set the necessary cookies on the response object
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      session: data.session
    });

  } catch (error: any) {
    console.error('E2E Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
