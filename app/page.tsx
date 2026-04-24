"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Target,
  Brain,
  Inbox,
  Link2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI ATS Optimizer",
    desc: "Beat the bots. AI rewrites your bullets using the STAR method for 90+ scores.",
    icon: Target,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-500/20"
  },
  {
    title: "Smart Job Matching",
    desc: "Semantic analysis matches your skills to JDs with 99% accuracy.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-500/20"
  },
  {
    title: "Auto-Apply Agent",
    desc: "Your AI agent applies to 100+ curated jobs while you sleep.",
    icon: Bot,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-500/20"
  },
  {
    title: "Recruiter Inbox",
    desc: "Unified view of all recruiter messages with AI-drafted replies.",
    icon: Inbox,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-500/20"
  },
  {
    title: "Multi-Portal Sync",
    desc: "One-click connection to LinkedIn, Indeed, and Naukri.",
    icon: Link2,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-500/20"
  },
  {
    title: "Real-time Dashboard",
    desc: "Track your application velocity and interview pipeline live.",
    icon: BarChart3,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-500/20"
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Ambient Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-medium backdrop-blur-md mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v2.0 Now Live: AI Agent Stealth Mode
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight mb-6">
              Apply to 100 jobs <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient-x">
                while you sleep.
              </span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              The first autonomous job search engine. <br />
              Connect portals, optimize your resume, and let the AI Agent handle the grind.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all hover:scale-105 hover:bg-blue-50 active:scale-95 flex items-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Start for free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 bg-white/5 text-white rounded-full font-bold text-lg transition-all hover:bg-white/10 border border-white/10 backdrop-blur-md"
              >
                How it works
              </Link>
            </div>
          </motion.div>

          {/* Premium Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative mt-20 max-w-5xl mx-auto group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-1000"></div>
            <div className="relative p-3 rounded-[2rem] bg-[#0F0F0F]/80 border border-white/20 backdrop-blur-2xl shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-[#050505] aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60 z-10" />
                <img
                  src="https://via.placeholder.com/1200x800/050505/333?text=HireX+Autonomous+Dashboard"
                  alt="HireX Dashboard"
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale contrast-125">
          <div className="text-xl font-bold text-white">LinkedIn</div>
          <div className="text-xl font-bold text-white">Indeed</div>
          <div className="text-xl font-bold text-white">Naukri</div>
          <div className="text-xl font-bold text-white">Glassdoor</div>
          <div className="text-xl font-bold text-white">Monster</div>
        </div>
      </section>

      {/* How It Works - SaaS Layout */}
      <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Engineered for <span className="text-blue-500">Efficiency.</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              We've automated the most tedious parts of the job search.
              No more manual filling. No more ghosting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Resume Optimization", desc: "AI analyzes your target role and rewrites your resume to hit a 90+ ATS score instantly.", icon: Zap },
              { step: "02", title: "Portal Connection", desc: "Securely sync with major portals. Our agent maps your profile across all platforms.", icon: Link2 },
              { step: "03", title: "Autonomous Apply", desc: "Set your salary and role. The AI agent applies to matches while you relax.", icon: Bot },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative p-10 rounded-[2rem] bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-500 group overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                      <item.icon size={24} />
                    </div>
                    <span className="text-4xl font-black text-white/10 group-hover:text-blue-500/20 transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  <p className="text-white/40 text-base leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Premium SaaS Style */}
      <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">The Full AI Stack</h2>
            <p className="text-white/40 text-lg">A comprehensive ecosystem to accelerate your career.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group"
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                  f.bg, f.color, f.border
                )}>
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Dynamic Counter */}
      <section className="py-32 px-6 text-center space-y-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Live Application Feed
        </div>
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
            2,847 applications sent
          </span>
          <br />
          <span className="text-white/20">this week.</span>
        </h2>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-blue-600/20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Ready to skip the grind?</h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto font-medium">
              Join 5,000+ professionals who have automated their job search.
              Start applying autonomously today.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-full font-black text-xl transition-all hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Get Started Now
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30">H</div>
            <span className="text-white font-bold text-2xl tracking-tighter">Hire<span className="text-blue-500">X</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            <Link href="#" className="hover:text-white transition-colors">Blog</Link>
          </div>
          <div className="text-white/20 text-xs font-bold uppercase tracking-widest">
            © 2026 HireX AI. Built in Pune, India 🇮🇳
          </div>
        </div>
      </footer >
    </div>
  );
}
