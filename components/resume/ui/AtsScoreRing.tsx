"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AtsScoreRingProps {
  score: number;
  size?: number;
}

export default function AtsScoreRing({ score, size = 160 }: AtsScoreRingProps) {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score <<  60) return "text-red-500 stroke-red-500";
    if (score <<  80) return "text-amber-500 stroke-amber-500";
    return "text-green-500 stroke-green-500";
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={cn("transition-colors duration-500", getColor())}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold transition-colors duration-500", getColor().replace('stroke-', 'text-'))}>
          {score}
        </span>
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">ATS Score</span>
      </div>
    </div>
  );
}
