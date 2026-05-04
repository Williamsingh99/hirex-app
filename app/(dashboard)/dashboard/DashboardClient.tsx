"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Target,
  Briefcase,
  TrendingUp,
  Bot,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import StatsGrid from "@/components/dashboard/stats/StatsGrid";
import ApplicationTracker from "@/components/dashboard/applications/ApplicationTracker";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DashboardClient({ initialStats, initialApplications }: {
  initialStats: any;
  initialApplications: any[];
}) {
  const router = useRouter();
  const [isAgentRunning, setIsAgentRunning] = useState(false);

  const toggleAgent = async () => {
    const newState = !isAgentRunning;
    setIsAgentRunning(newState);

    if (newState) {
      toast.success("AI Agent started - Searching for jobs...");
      try {
        const res = await fetch('/api/agent/auto-queue', {
          method: 'POST',
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Agent failed to run');

        toast.success(`Agent complete! Evaluated ${data.evaluated} jobs and auto-applied to ${data.applied}!`);
        router.refresh();
      } catch (error: any) {
        toast.error(`Agent error: ${error.message}`);
        setIsAgentRunning(false);
      }
    } else {
      toast.success("AI Agent paused");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-white/40">Real-time monitoring of your autonomous job search.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-500",
            isAgentRunning
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-white/5 border-white/10 text-white/40"
          )}>
            <span className={cn(
              "relative flex h-2 w-2",
              isAgentRunning && "animate-pulse"
            )}>
              <span className="absolute inset-0 rounded-full bg-current opacity-75 animate-ping" />
              <span className="relative rounded-full h-2 w-2 bg-current" />
            </span>
            {isAgentRunning ? "Agent Active" : "Agent Idle"}
          </div>
          <button
            onClick={toggleAgent}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 flex items-center gap-2",
              isAgentRunning
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
            )}
          >
            {isAgentRunning ? <><Zap size={16} /> Stop Agent</> : <><Bot size={16} /> Start AI Agent</>}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Main Stats - Spans 8 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 space-y-6"
        >
          <StatsGrid stats={initialStats} />

          {/* Recent Activity Feed */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
              </div>
              <button className="text-xs text-white/40 hover:text-white transition-colors">View all</button>
            </div>

            <ApplicationTracker initialApplications={initialApplications} />
          </div>
        </motion.div>

        {/* Right Sidebar - Spans 4 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          {/* AI Status Card */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/40 transition-all" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">AI Performance</h3>
                <TrendingUp size={16} className="text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white">{initialStats.match_rate}% Match Rate</div>
              <p className="text-xs text-white/40 leading-relaxed">
                Your current resume is performing exceptionally well for your targeted roles.
              </p>
              <div className="pt-4">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${initialStats.match_rate}%` }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Optimize Resume", icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10" },
                { label: "Update Targets", icon: Target, color: "text-purple-400", bg: "bg-purple-400/10" },
                { label: "Check Inbox", icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-400/10" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 text-left group"
                >
                  <div className={cn("p-2 rounded-lg", action.bg, action.color)}>
                    <action.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Tracker */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Application Goal</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Target: 100 Apps</span>
              <span className="text-sm font-bold text-white">{initialStats.total_applied}/100</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((initialStats.total_applied / 100) * 100, 100)}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
            <p className="text-[10px] text-white/40 text-center pt-2">
              Keep pushing forward!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
