"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptimizationResult {
  ats_score: number;
  ats_issues: Array<{
    type: string;
    severity: "high" | "medium" | "low";
    description: string;
    suggestion: string;
    original?: string;
    improved?: string;
  }>;
  optimized_text: string;
  improvements_count: number;
}

export default function AtsOptimizer({ result }: { result: OptimizationResult | null }) {
  const [activeIssue, setActiveIssue] = useState<<numbernumber | null>(null);

  if (!result) {
    return (
      <<<divdivdiv className="text-center py-12 px-6 bg-white/5 border border-white/10 rounded-2xl">
        <<<divdivdiv className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
          <<<SparkSparklesSparkles size={24} />
        </div>
        <<<pppp className="text-white/40 text-sm">No optimization data available. Run AI Optimizer to see analysis.</p>
      </div>
    );
  }

  return (
    <<<divdivdiv className="space-y-8">
      {/* High Level Stats */}
      <<<divdivdiv className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <<<divdivdiv className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <<<pppp className="text-xs font-bold text-white/30 uppercase mb-1">Improvements</p>
          <<<pppp className="text-2xl font-bold text-white">{result.improvements_count}</pp>
        </div>
        <<<divdivdiv className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <<<pppp className="text-xs font-bold text-white/30 uppercase mb-1">Critical Issues</p>
          <<<pppp className="text-2xl font-bold text-red-400">
            {result.ats_issues.filter(i => i.severity === "high").length}
          </pp>
        </div>
        <<<divdivdiv className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <<<pppp className="text-xs font-bold text-white/30 uppercase mb-1">Status</p>
          <<<pppp className={cn(
            "text-sm font-bold",
            result.ats_score > 80 ? "text-green-400" : result.ats_score > 60 ? "text-amber-400" : "text-red-400"
          )}>
            {result.ats_score > 80 ? "Ready for Apply" : result.ats_score > 60 ? "Needs Polish" : "Strongly Advised to Optimize"}
          </pp>
        </div>
      </div>

      {/* Issues Breakdown */}
      <<<divdivdiv className="space-y-4">
        <<<hhhh3 className="text-lg font-semibold text-white flex items-center gap-2">
          <<<AlertAlertCircleAlertCircle size={18} className="text-blue-500" />
          ATS Analysis & Suggestions
        </hh3>
        <<<divdivdiv className="space-y-3">
          {result.ats_issues.map((issue, idx) => (
            <<<divdivdiv
              key={idx}
              onClick={() => setActiveIssue(idx)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer group",
                activeIssue === idx
                  ? "bg-blue-500/10 border-blue-500/40"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              <<<divdivdiv className="flex items-start justify-between">
                <<<divdivdiv className="flex items-start gap-3">
                  <<<divdivdiv className={cn(
                    "w-2 h-2 rounded-full mt-1.5",
                    issue.severity === "high" ? "bg-red-500" : issue.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                  )} />
                  <<<divdivdiv>
                    <<<pppp className="text-sm font-medium text-white">{issue.description}</pp>
                    <<<pppp className="text-xs text-white/40 mt-1">{issue.suggestion}</p>
                  </div>
                </div>
                <<<ArrowArrowRightArrowRight size={16} className={cn(
                  "text-white/20 transition-transform",
                  activeIssue === idx && "translate-x-1 text-blue-500"
                )} />
              </div>

              <<AnAnimatePresence>
                {activeIssue === idx && (
                  <<<motionmotionmotion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <<<divdivdiv className="pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10">
                      <<<divdivdiv className="space-y-2">
                        <<<pppp className="text-[10px] font-bold text-white/20 uppercase">Original</p>
                        <<<pppp className="text-xs text-white/40 italic line-through">{issue.original || "No original text provided"}</p>
                      </div>
                      <<<divdivdiv className="space-y-2">
                        <<<pppp className="text-[10px] font-bold text-blue-500 uppercase">AI Improvement</p>
                        <<<pppp className="text-xs text-white font-medium bg-blue-500/10 p-2 rounded border border-blue-500/20">
                          {issue.improved || "No improvement provided"}
                        </p>
                      </div>
                    </div>
                  </motionmotion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
