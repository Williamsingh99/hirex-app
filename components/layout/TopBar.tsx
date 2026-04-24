"use client";

import React from "react";
import { Bell, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopBar() {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search jobs, applications..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
        </button>
        <div className="h-8 w-[1px] bg-white/10 mx-1" />
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">Alex Rivera</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Professional</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-white/10" />
        </div>
      </div>
    </header>
  );
}
