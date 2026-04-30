"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Send } from "lucide-react";
import ApplicationRow from "@/components/dashboard/applications/ApplicationRow";

// Temporary mock data until Supabase is fully configured
const MOCK_APPLICATIONS = [
  {
    id: '1',
    status: 'applied',
    portal: 'linkedin',
    applied_via: 'AI Agent',
    resume_version: '2',
    last_status_update: new Date().toISOString(),
    applied_at: new Date().toISOString(),
    cover_letter: 'Dear Hiring Manager, I am a software engineer with 5 years of experience...',
    job: { title: 'Senior Frontend Engineer', company: 'Vercel', apply_url: '#' }
  },
  {
    id: '2',
    status: 'interview',
    portal: 'direct',
    applied_via: 'Manual',
    resume_version: '1',
    last_status_update: new Date().toISOString(),
    applied_at: new Date(Date.now() - 86400000).toISOString(),
    cover_letter: 'I am highly interested in the Product Engineer role at Linear...',
    job: { title: 'Product Engineer', company: 'Linear', apply_url: '#' }
  },
  {
    id: '3',
    status: 'viewed',
    portal: 'indeed',
    applied_via: 'AI Agent',
    resume_version: '3',
    last_status_update: new Date().toISOString(),
    applied_at: new Date(Date.now() - 172800000).toISOString(),
    cover_letter: 'As an experienced fullstack developer, I admire Stripe\'s impact...',
    job: { title: 'Software Engineer', company: 'Stripe', apply_url: '#' }
  },
];

export default function ApplicationsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Applications</h1>
          <p className="text-white/40">Track and manage all your job applications in one place.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button className="p-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Send size={20} className="text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Application History</h2>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01]">
          {MOCK_APPLICATIONS.map((app) => (
            <ApplicationRow
              key={app.id}
              application={app}
              job={app.job}
              isExpanded={expandedId === app.id}
              onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
            />
          ))}
          {MOCK_APPLICATIONS.length === 0 && (
            <div className="p-12 text-center text-white/40">
              No applications found. Start your AI Agent to begin applying!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
