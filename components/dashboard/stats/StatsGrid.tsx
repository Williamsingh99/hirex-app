"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Zap,
  Calendar,
  Trophy,
  MessageSquare,
  Target,
  TrendingUp,
  Link2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  stats: any;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const metrics = [
    { label: "Total Applied", value: stats.total_applied, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Applied Today", value: stats.applied_today, icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Interviews", value: stats.interviews_scheduled, icon: Calendar, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Offers Received", value: stats.offers_received, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Unread Messages", value: stats.unread_messages, icon: MessageSquare, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "ATS Score", value: `${stats.ats_score}%`, icon: Target, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Match Rate", value: `${stats.match_rate}%`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Portals Connected", value: `${stats.portals_connected}/3`, icon: Link2, color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <<divdiv className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <<motionmotion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all group"
        >
          <<divdiv className="flex items-center justify-between mb-4">
            <<divdiv className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", metric.bg, metric.color)}>
              <<metric.iconmetric.icon size={20} />
            </div>
            <<divdiv className="text-xs font-bold text-white/20 uppercase tracking-widest">Live</div>
          </div>
          <<divdiv>
            <<pp className="text-2xl font-bold text-white">{metric.value}</pp>
            <<pp className="text-xs text-white/40 font-medium">{metric.label}</p>
          </div>
        </motionmotion.div>
      ))}
    </div>
  );
}
