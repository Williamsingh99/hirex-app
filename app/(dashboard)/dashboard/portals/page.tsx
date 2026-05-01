// @ts-nocheck
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Lock,
  Search,
  Zap,
  Loader2,
  Briefcase,
  MapPin,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const portals = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "World's largest professional network",
    color: "from-blue-600/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    dot: "bg-blue-400",
    emoji: "💼",
    supported: true,
  },
  {
    id: "indeed",
    name: "Indeed",
    description: "Largest job aggregator globally",
    color: "from-indigo-600/20 to-indigo-500/5",
    borderColor: "border-indigo-500/30",
    iconColor: "text-indigo-400",
    dot: "bg-indigo-400",
    emoji: "🔍",
    supported: false,
  },
  {
    id: "naukri",
    name: "Naukri",
    description: "India's #1 job portal",
    color: "from-rose-600/20 to-rose-500/5",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
    dot: "bg-rose-400",
    emoji: "🇮🇳",
    supported: false,
  },
  {
    id: "glassdoor",
    name: "Glassdoor",
    description: "Jobs with company reviews",
    color: "from-emerald-600/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    dot: "bg-emerald-400",
    emoji: "🏢",
    supported: false,
  },
];

export default function PortalsPage() {
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [maxJobs, setMaxJobs] = useState(20);
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleSyncLinkedIn = async () => {
    if (!keywords.trim()) {
      toast.error("Please enter a job title or keywords");
      return;
    }

    setSyncing(true);
    toast.info("🚀 Apify scraper starting... this takes 1-2 minutes");

    try {
      const res = await fetch("/api/jobs/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, location, maxJobs }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sync failed");
      }

      setLastResult(data);
      toast.success(`✅ ${data.inserted} jobs synced from LinkedIn!`);
      setShowSyncModal(false);
    } catch (err: any) {
      toast.error(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Connection Matrix
          </h1>
          <p className="text-white/40">
            Sync real jobs from LinkedIn directly into your HireX feed.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck size={14} />
          Powered by Apify
        </div>
      </div>

      {/* Last Sync Result Banner */}
      {lastResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <CheckCircle2 className="text-emerald-400" size={20} />
          <div>
            <p className="text-sm font-semibold text-white">
              Last sync: {lastResult.inserted} jobs imported
            </p>
            <p className="text-xs text-white/40">
              Keywords: "{lastResult.keywords}" · Location:{" "}
              {lastResult.location}
            </p>
          </div>
        </motion.div>
      )}

      {/* Portal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {portals.map((portal, i) => (
          <motion.div
            key={portal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "relative rounded-3xl border p-6 bg-gradient-to-br overflow-hidden group",
              portal.color,
              portal.borderColor
            )}
          >
            {/* Glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-2xl opacity-20 bg-white group-hover:opacity-30 transition-all" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{portal.emoji}</div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {portal.name}
                  </h2>
                  <p className="text-xs text-white/40">{portal.description}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                  portal.supported
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-white/5 text-white/30"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    portal.supported ? "bg-emerald-400" : "bg-white/20"
                  )}
                />
                {portal.supported ? "Active" : "Coming Soon"}
              </div>
            </div>

            {/* Action */}
            {portal.supported ? (
              <button
                onClick={() => setShowSyncModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
              >
                <Zap size={16} />
                Sync Jobs Now
              </button>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 text-white/20 text-sm font-medium cursor-not-allowed">
                <Lock size={14} />
                Coming Soon
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="text-blue-400" size={20} />
          <h2 className="text-lg font-semibold text-white">
            How Job Sync Works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "You enter keywords",
              desc: "Search by job title, skills, or company name",
              icon: <Search size={18} className="text-blue-400" />,
            },
            {
              step: "02",
              title: "Apify scrapes LinkedIn",
              desc: "Our cloud scraper fetches real job listings in real-time",
              icon: <RefreshCw size={18} className="text-purple-400" />,
            },
            {
              step: "03",
              title: "Jobs appear in your feed",
              desc: "Data is saved to Supabase and shown in Opportunity Feed",
              icon: <Zap size={18} className="text-emerald-400" />,
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-white/30 font-mono mb-1">
                  Step {item.step}
                </p>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all" />
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-blue-400" size={20} />
          <h2 className="text-lg font-semibold text-white">
            Security Protocol
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "No Password Stored",
              desc: "We never ask for your LinkedIn password. Apify uses their own proxy network.",
            },
            {
              title: "Read-Only Scraping",
              desc: "We only read public job listings — no accounts are logged into.",
            },
            {
              title: "Your Data, Your Control",
              desc: "All scraped data is stored in your private Supabase instance.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-2">
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <CheckCircle2 size={16} className="text-emerald-400" />
                {item.title}
              </div>
              <p className="text-xs text-white/30">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Modal */}
      <AnimatePresence>
        {showSyncModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowSyncModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0f0f14] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    💼 Sync LinkedIn Jobs
                  </h3>
                  <p className="text-sm text-white/40 mt-1">
                    Enter your search criteria — Apify will scrape live results
                  </p>
                </div>
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
                    Job Title / Keywords *
                  </label>
                  <input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. React Developer, Frontend Engineer"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
                    Location (optional)
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                      size={16}
                    />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bangalore, India or Remote"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
                    Max Jobs to Fetch: {maxJobs}
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={maxJobs}
                    onChange={(e) => setMaxJobs(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-white/20">
                    <span>5 (fast)</span>
                    <span>50 (thorough)</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="flex gap-2.5 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/70">
                  Scraping takes 1–2 minutes. Don't close this page. Results
                  will appear in your Opportunity Feed.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleSyncLinkedIn}
                disabled={syncing || !keywords.trim()}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-bold transition-all",
                  syncing || !keywords.trim()
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95"
                )}
              >
                {syncing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scraping LinkedIn... please wait
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Start Job Sync
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
