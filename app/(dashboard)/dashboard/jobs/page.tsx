// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Briefcase,
  Trophy,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import JobMatchCard from "@/components/dashboard/jobs/JobMatchCard";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Job, ApplicationRecord } from "@/types/database";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      toast.error(`Failed to fetch jobs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleQueue(jobId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          portal_name: 'linkedin', // Defaulting to linkedin, in a real flow this would come from the Job record
          resume_id: null, // Nullable as per Phase 1 fix
          applied_via: 'auto',
          status: 'Queued',
        });

      if (error) throw error;
      toast.success("Job successfully added to AI Auto-Queue!");
    } catch (err: any) {
      toast.error(`Queueing failed: ${err.message}`);
    }
  }

  const filteredJobs = jobs.filter(job =>
    (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     job.company.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filter === "all" || job.portal_name === filter || job.employment_type === filter)
  );

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Opportunity Feed</h1>
          <p className="text-white/40">AI-curated job matches based on your professional identity.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
              placeholder="Search roles, companies..."
            />
          </div>
          <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all active:scale-95">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {["all", "linkedin", "indeed", "naukri", "Remote"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border capitalize",
              filter === f
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Jobs Feed */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 w-full bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <JobMatchCard
                  key={job.id}
                  job={{
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    salary_min: job.salary_min,
                    salary_max: job.salary_max,
                  }}
                  match={{
                    id: job.id,
                    match_score: 95, // In a real app, this would come from a 'job_matches' table or AI on the fly
                    missing_skills: [],
                    match_reason: job.description
                  }}
                  onQueue={() => handleQueue(job.id)}
                  onSkip={(id) => toast.info(`Skipped job ${id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
              <Search size={40} className="text-white/20" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">No matches found</h3>
              <p className="text-white/40 text-sm">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
