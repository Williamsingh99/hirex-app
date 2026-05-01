"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Briefcase, MapPin, DollarSign, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobMatchCardProps {
  match: any;
  job: any;
  onQueue: (id: string) => void;
  onSkip: (id: string) => void;
}

export default function JobMatchCard({ match, job, onQueue, onSkip }: JobMatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    return "bg-gray-500";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm transition-all hover:border-white/20"
    >
      {/* Top Row: Logo + Title + Score */}
      <div className="flex justify-between items-center gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 flex-shrink-0 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/ /g, '')}.com`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <Briefcase size={14} className="text-white/30 absolute" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white leading-tight truncate">{job.title}</h3>
            <p className="text-white/40 text-xs truncate">{job.company}</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="text-lg font-black text-white">{match.match_score}%</span>
          <div className={`w-2 h-2 rounded-full ${getScoreColor(match.match_score)}`} />
        </div>
      </div>

      {/* Meta Row: location + salary inline */}
      <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
        <span className="flex items-center gap-1">
          <MapPin size={11} className="text-blue-500" />
          {job.location || 'Remote'}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign size={11} className="text-blue-500" />
          {job.salary_min ? `₹${job.salary_min.toLocaleString()}` : 'Salary TBD'}
        </span>
      </div>

      {/* AI Insight — single line, truncated */}
      {match.match_reason && (
        <div className="flex items-start gap-2 px-3 py-2 bg-blue-500/8 rounded-xl border border-blue-500/15 mb-3">
          <Sparkles size={11} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-white/50 italic line-clamp-2 leading-relaxed">
            {match.match_reason}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onQueue(match.id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
        >
          <Zap size={12} />
          Auto-Queue
        </button>
        {match.apply_url && (
          <a
            href={match.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            View
          </a>
        )}
        <button
          onClick={() => onSkip(match.id)}
          className="px-3 py-2 rounded-xl text-xs font-bold text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
        >
          Skip
        </button>
      </div>
    </motion.div>
  );
}
