"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationRow from "./ApplicationRow";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  status: string;
  applied_at: string;
  portal_name: string;
  applied_via: string;
  resume_version: string;
  updated_at: string;
  cover_letter: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  apply_url: string;
}

interface ApplicationTrackerProps {
  initialApplications: Array<{
    applications: Application;
    jobs: Job;
  }>;
}

export default function ApplicationTracker({ initialApplications }: ApplicationTrackerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">
          Application Pipeline
        </h2>
        <span className="text-[10px] font-medium text-white/30">
          {initialApplications.length} Active Tracks
        </span>
      </div>

      <div className="divide-y divide-white/5">
        <AnimatePresence>
          {initialApplications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                <Briefcase size={20} />
              </div>
              <p className="text-sm text-white/40">No applications tracked yet.</p>
              <p className="text-xs text-white/20">Start auto-queuing jobs to fill your pipeline.</p>
            </div>
          ) : (
            initialApplications.map(({ applications, jobs }) => (
              <ApplicationRow
                key={applications.id}
                application={applications}
                job={jobs}
                isExpanded={expandedId === applications.id}
                onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Briefcase({ size = 20 }: { size?: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 8h-4a2 2 0 0 0-2 2v0a2 2 0 0 1-2 2H6a2 2 0 0 0-2 0v0a2 2 0 0 0 2-2h2"/></svg>;
}
