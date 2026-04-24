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

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const mockJobs = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      company: 'Vercel',
      location: 'Remote',
      salary: '₹24L - ₹40L',
      score: 98,
      category: 'Frontend',
      description: 'Looking for a React expert to build the next generation of deployment platforms.',
      posted_at: '2h ago',
    },
    {
      id: '2',
      title: 'Product Engineer',
      company: 'Linear',
      location: 'Remote, US',
      salary: '₹30L - ₹50L',
      score: 92,
      category: 'Fullstack',
      description: 'Join our small, high-performance team focused on crafting the best issue tracker in the world.',
      posted_at: '5h ago',
    },
    {
      id: '3',
      title: 'Software Engineer',
      company: 'Stripe',
      location: 'Bangalore, India',
      salary: '₹20L - ₹35L',
      score: 85,
      category: 'Backend',
      description: 'Scaling payment infrastructure for millions of businesses globally.',
      posted_at: '1d ago',
    },
    {
      id: '4',
      title: 'Frontend Lead',
      company: 'Airbnb',
      location: 'Remote',
      salary: '₹35L - ₹60L',
      score: 78,
      category: 'Frontend',
      description: 'Designing world-class travel experiences with a focus on accessibility and performance.',
      posted_at: '2d ago',
    },
  ];

  const filteredJobs = mockJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filter === "all" || job.category === filter)
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
        {["all", "Frontend", "Backend", "Fullstack", "Remote"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
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
                  job={job}
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
