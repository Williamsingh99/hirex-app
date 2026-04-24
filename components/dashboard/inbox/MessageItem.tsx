"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Sparkles, Send, Trash2, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: any;
  isActive: boolean;
  onClick: () => void;
}

export default function MessageItem({ message, isActive, onClick }: MessageItemProps) {
  const typeColors: Record<string, string> = {
    interview_invite: "bg-green-500/10 text-green-400 border-green-500/20",
    rejection: "bg-red-500/10 text-red-400 border-red-500/20",
    offer: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    general: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all border-l-2 group",
        isActive
          ? "bg-white/10 border-blue-500"
          : "bg-transparent border-transparent hover:bg-white/5"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-bold text-white truncate max-w-[150px]">{message.sender_name}</span>
        <span className="text-[10px] text-white/30">{new Date(message.received_at).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-white/60 truncate">{message.subject}</span>
        <div className={cn(
          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter border",
          typeColors[message.message_type] || typeColors.general
        )}>
          {message.message_type.replace('_', ' ')}
        </div>
      </div>
      <p className="text-xs text-white/30 truncate mt-1">{message.ai_summary}</p>
    </div>
  );
}
