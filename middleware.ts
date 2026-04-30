import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // If env variables are missing, we bypass the middleware strictly to avoid crashing the whole app
  // In a real production deployment, these variables MUST be set.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables missing. Bypassing middleware auth checks.");
    return NextResponse.next()
  }

  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If user is not logged in and trying to access dashboard, redirect to login
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user is logged in and trying to access login, redirect to dashboard
    if (user && request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware Auth Error:", error);
    // On auth error, force redirect to login for protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
}
