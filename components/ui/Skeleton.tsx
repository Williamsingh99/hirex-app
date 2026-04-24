"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <<divdiv className={cn(
      "animate-pulse bg-white/10 rounded-xl",
      className
    )} />
  );
}
