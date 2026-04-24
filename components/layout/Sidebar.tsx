"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Link2,
  Search,
  Send,
  Inbox,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile", href: "/dashboard/profile", icon: User },
  { id: "resume", label: "Resume", href: "/dashboard/resume", icon: FileText },
  { id: "portals", label: "Portals", href: "/dashboard/portals", icon: Link2 },
  { id: "jobs", label: "Find Jobs", href: "/dashboard/jobs", icon: Search },
  { id: "applications", label: "Applications", href: "/dashboard/applications", icon: Send },
  { id: "inbox", label: "Messages", href: "/dashboard/inbox", icon: Inbox },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      className="fixed left-0 top-0 h-screen bg-[#111111] border-r border-white/5 flex flex-col z-50 transition-all duration-300 ease-in-out"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10 blur-xl" />
        <div className={cn(
          "relative flex items-center gap-3 transition-opacity duration-200",
          isCollapsed && "opacity-0 pointer-events-none"
        )}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            H
          </div>
          <span className="text-white font-bold text-xl tracking-tighter">
            Hire<span className="text-blue-500">X</span>
          </span>
        </div>
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              H
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-white/5 text-white border-l-2 border-blue-500"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-blue-500" : "group-hover:text-white/70"
              )} />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!isCollapsed && item.id === "inbox" && (
                <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <div className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm font-medium truncate">Alex Rivera</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Pro Plan</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}
