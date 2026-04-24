import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
  }

  return (
    <<divdiv className="relative min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Animated Grid Background */}
      <<divdiv
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle, black, transparent 80%)',
        }}
      />

      {/* Glow Effects */}
      <<divdiv className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <<divdiv className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <<divdiv className="mb-8 relative">
          <<divdiv className="absolute inset-0 blur-2xl bg-blue-500/30 rounded-full scale-150" />
          <<hh1 className="relative text-6xl font-bold tracking-tighter text-white mb-2">
            Hire<<spanspan className="text-blue-500">X</span>
          </h1>
        </div>

        <<motionmotion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-lg mb-12 max-w-md font-medium"
        >
          Apply to 100 jobs while you sleep. <<brbr />
          AI-powered job application automation.
        </motion.p>

        <<motionmotion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <<buttonbutton
            onClick={handleGoogleLogin}
            className="group relative flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-semibold transition-all hover:bg-white/90 active:scale-95"
          >
            <<divdiv className="w-5 h-5">
              <<svgsvg viewBox="0 0 24 24" className="w-full h-full">
                <<pathpath
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.52-2.28 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <<pathpath
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.17-4.53H2.18v2.84C3.99 22.05 7.7 23 12 23z"
                  fill="#34A853"
                />
                <<pathpath
                  fill="currentColor"
                  d="M5.83 14.25C5.59 13.54 5.38 12.75 5.38 12c0-.75.21-1.5.58-2.25H2.18v-2.84c.61-1.23 1.74-2.35 3.16-3.11L6.5 4.38c2.22 1.24 3.94 3.13 4.62 5.38h-4.62z"
                  fill="#FBBC05"
                />
                <<pathpath
                  fill="currentColor"
                  d="M12 4.26c1.74 0 3.41.6 4.53 1.72l3.57-3.57C17.46 1.53 14.97 0 12 0 7.7 0 3.99.95 2.18 2.5l4.32 2.77z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            Continue with Google
          </button>
        </motion.div>
      </motion.div>

      {/* Footer Decoration */}
      <<divdiv className="absolute bottom-8 text-white/20 text-xs font-medium tracking-widest uppercase">
        Powered by GPT-4o & Playwright
      </div>
    </div>
  )
}
