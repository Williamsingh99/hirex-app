"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  Upload,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  History,
  Eye, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ResumeUploader from "@/components/resume/ResumeUploader";
import AtsScoreRing from "@/components/resume/ui/AtsScoreRing";
import AtsOptimizer from "@/components/resume/ui/AtsOptimizer";

export default function ResumePage() {
  const [currentResume, setCurrentResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const mockResumes = [
    { id: '1', name: 'Software_Engineer_v1.pdf', score: 68, updated: '2 days ago', size: '1.2MB' },
    { id: '2', name: 'Frontend_Expert_Final.pdf', score: 92, updated: '5 hours ago', size: '1.1MB' },
    { id: '3', name: 'Generic_Resume.pdf', score: 45, updated: '1 month ago', size: '1.5MB' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-white/40">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <p className="text-sm font-medium tracking-widest uppercase">Initializing Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Optimization Studio</h1>
          <p className="text-white/40">Engineer your professional identity for maximum ATS visibility.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all text-sm font-medium">
            <History size={16} />
            Version History
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all text-sm font-bold shadow-lg shadow-blue-600/20">
            <Plus size={16} />
            New Version
          </button>
        </div>
      </div>

      {/* Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Navigation & Resume Library */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-blue-400" />
                <span className="text-sm font-bold text-white">Resume Library</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {mockResumes.map((res) => (
                <div
                  key={res.id}
                  onClick={() => setCurrentResume(res)}
                  className={cn(
                    "group p-4 rounded-2xl border transition-all cursor-pointer",
                    currentResume?.id === res.id
                      ? "bg-blue-600/10 border-blue-500/40"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10 text-white/40 group-hover:text-blue-400 transition-colors">
                        <FileText size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{res.name}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">{res.updated} • {res.size}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold border",
                      res.score > 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      res.score > 60 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {res.score}%
                    </div>
                  </div>
                  {currentResume?.id === res.id && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <button className="text-[10px] text-white/40 hover:text-white transition-colors flex items-center gap-1">
                        <Eye size={12} /> Preview
                      </button>
                      <button className="text-[10px] text-white/40 hover:text-white transition-colors flex items-center gap-1">
                        <Download size={12} /> Export
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Pro Tip</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Updating your keywords for "Product Engineering" could increase your match rate by <span className="text-white font-bold">12%</span> for Tier-1 companies.
              </p>
              <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold text-white border border-white/10">
                Run AI Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Right: Optimization Workspace */}
        <div className="lg:col-span-8 space-y-8">
          {!currentResume ? (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02]">
              <div className="p-6 rounded-full bg-white/5 border border-white/10 mb-6">
                <Upload size={48} className="text-white/10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">No Resume Selected</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto">
                  Select a resume from your library or upload a new one to start the optimization process.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <ResumeUploader onUploadSuccess={() => {}} />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Score & Status Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm gap-6">
                <div className="flex items-center gap-6">
                  <AtsScoreRing score={currentResume.score} />
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">Optimization Score</h2>
                    <p className="text-white/40 text-sm">AI-calculated compatibility with target roles.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    currentResume.score > 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  )}>
                    <CheckCircle2 size={12} />
                    ATS Validated
                  </div>
                  <button className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20">
                    <Sparkles size={16} />
                    Optimize Now
                  </button>
                </div>
              </div>

              {/* Optimizer Interface */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Zap size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">AI-Powered Improvements</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Real-time Analysis Active
                  </div>
                </div>

                <AtsOptimizer result={null} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
