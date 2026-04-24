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
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI ATS Optimizer",
    desc: "Beat the bots. AI rewrites your bullets using the STAR method for 90+ scores.",
    icon: Target,
    color: "text-blue-500"
  },
  {
    title: "Smart Job Matching",
    desc: "Semantic analysis matches your skills to JDs with 99% accuracy.",
    icon: Brain,
    color: "text-purple-500"
  },
  {
    title: "Auto-Apply Agent",
    desc: "Your AI agent applies to 100+ curated jobs while you sleep.",
    icon: Bot,
    color: "text-cyan-500"
  },
  {
    title: "Recruiter Inbox",
    desc: "Unified view of all recruiter messages with AI-drafted replies.",
    icon: Inbox,
    color: "text-red-500"
  },
  {
    title: "Multi-Portal Sync",
    desc: "One-click connection to LinkedIn, Indeed, and Naukri.",
    icon: Link2,
    color: "text-indigo-500"
  },
  {
    title: "Real-time Dashboard",
    desc: "Track your application velocity and interview pipeline live.",
    icon: BarChart3,
    color: "text-emerald-500"
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight mb-6">
              Apply to 100 jobs <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400">
                while you sleep.
              </span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              HireX connects your Naukri, Indeed & LinkedIn. <br />
              AI rewrites your resume, matches jobs, and auto-applies 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all hover:bg-white/90 active:scale-95 flex items-center gap-2 group"
              >
                Start for free — no credit card
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative mt-20 max-w-5xl mx-auto"
          >
            <div className="relative p-2 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-[#111] aspect-video relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60 z-10" />
                <img
                  src="https://via.placeholder.com/1200x800/111/333?text=HireX+Dashboard+Preview"
                  alt="HireX Dashboard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">How it Works</h2>
            <p className="text-white/40">Three steps to a new career.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Upload Resume", desc: "Drop your PDF. Our AI optimizes it to a 90+ ATS score in seconds." },
              { step: "02", title: "Connect Portals", desc: "One-click sync with LinkedIn, Indeed, and Naukri to find the best roles." },
              { step: "03", title: "Auto-Apply", desc: "Set your criteria and let the AI agent apply 24/7 while you sleep." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group"
              >
                <span className="text-5xl font-black text-white/10 absolute top-4 right-6 group-hover:text-blue-500/20 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">The Full AI Stack</h2>
            <p className="text-white/40">Everything you need to dominate the job market.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 transition-transform group-hover:scale-110", f.color)}>
                  <f.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Live Activity
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          2,847 applications sent <br />
          <span className="text-white/30">this week.</span>
        </h2>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
            <span className="text-white font-bold text-xl tracking-tighter">Hire<span className="text-blue-500">X</span></span>
          </div>
          <div className="text-white/20 text-xs font-medium uppercase tracking-widest">
            Made in Pune, India 🇮🇳
          </div>
          <div className="flex gap-6 text-white/40 text-xs font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
