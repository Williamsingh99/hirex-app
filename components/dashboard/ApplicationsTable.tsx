"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Briefcase, MapPin, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationTableProps {
  applications: any[];
}

export default function ApplicationsTable({ applications }: ApplicationTableProps) {
  const statusColors: Record<string, string> = {
    applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    viewed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    shortlisted: "bg-green-500/10 text-green-400 border-green-500/20",
    interview: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <a href="/dashboard/applications" className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-medium">View all applications</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Job Role</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Portal</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {applications.map((app, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-sm text-white font-medium">{app.job?.title || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm text-white/60">{app.job?.company || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm text-white/40 capitalize">{app.portal}</td>
                <td className="px-6 py-4 text-sm text-white/40">{new Date(app.applied_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block",
                    statusColors[app.status] || statusColors.applied
                  )}>
                    {app.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
