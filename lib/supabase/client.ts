import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  // Use dummy values if env variables are missing to prevent crash, allowing the UI to render.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  return createBrowserClient(supabaseUrl, supabaseKey);
}
