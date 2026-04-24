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
    <<motionmotion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all hover:border-white/20 flex flex-col h-full"
    >
      <<divdiv className="flex justify-between items-start mb-4">
        <<divdiv className="flex items-center gap-3">
          <<divdiv className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
             {/* Favicon fallback */}
             <<imgimg src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/ /g, '')}.com`}
               className="w-full h-full object-cover"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=C";
               }}
             />
          </div>
          <<divdiv>
            <<hh3 className="text-lg font-bold text-white leading-tight">{job.title}</h3>
            <<pp className="text-white/40 text-sm">{job.company}</p>
          </div>
        </div>
        <<divdiv className="text-right">
          <<spanspan className="text-2xl font-black text-white">{match.match_score}%</spanspan>
          <<pp className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Match</p>
        </div>
      </div>

      <<divdiv className="space-y-3 mb-6 flex-1">
        <<divdiv className="flex items-center gap-3 text-xs text-white/60">
          <<MapPinMapPin size={14} className="text-blue-500" />
          <span>{job.location || "Remote"}</span>
        </div>
        <<divdiv className="flex items-center gap-3 text-xs text-white/60">
          <<DollarSignDollarSign size={14} className="text-blue-500" />
          <span>{job.salary_min ? `₹${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()}` : "Salary not disclosed"}</span>
        </div>

        <<divdiv className="pt-3 space-y-2">
          <<pp className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Missing Skills</p>
          <<divdiv className="flex flex-wrap gap-2">
            {match.missing_skills?.length > 0 ? (
              match.missing_skills.map((skill: string, i: number) => (
                <<spanspan key={i} className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <<spanspan className="text-green-400 text-xs font-medium">No missing skills!</spanspan>
            )}
          </div>
        </div>

        <<divdiv className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mt-4">
          <<divdiv className="flex items-center gap-2 text-blue-400 mb-1">
            <<SparklesSparkles size={14} />
            <<spanspan className="text-[10px] font-bold uppercase tracking-widest">AI Insight</span>
          </div>
          <<pp className="text-xs text-white/80 italic leading-relaxed">
            "{match.match_reason}"
          </pp>
        </div>
      </div>

      <<divdiv className="flex gap-3 mt-auto pt-6">
        <<buttonbutton
          onClick={() => onQueue(match.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
        >
          <<ZapZap size={14} />
          Auto-Queue
        </button>
        <<buttonbutton
          onClick={() => onSkip(match.id)}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-95"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
