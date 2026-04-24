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
    <<divdiv className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      <<divdiv className="p-6 border-b border-white/10 flex items-center justify-between">
        <<hh3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <<aa href="/dashboard/applications" className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-medium">View all applications</a>
      </div>
      <<divdiv className="overflow-x-auto">
        <<tabletable className="w-full text-left border-collapse">
          <<theadthead className="bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <<trtr>
              <<thth className="px-6 py-4">Job Role</th>
              <<thth className="px-6 py-4">Company</th>
              <<thth className="px-6 py-4">Portal</th>
              <<thth className="px-6 py-4">Date</th>
              <<thth className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <<tbodytbody className="divide-y divide-white/5">
            {applications.map((app, idx) => (
              <<trtr key={idx} className="hover:bg-white/5 transition-colors group">
                <<tdtd className="px-6 py-4 text-sm text-white font-medium">{app.job?.title || 'Unknown'}</td>
                <<tdtd className="px-6 py-4 text-sm text-white/60">{app.job?.company || 'Unknown'}</td>
                <<tdtd className="px-6 py-4 text-sm text-white/40 capitalize">{app.portal}</td>
                <<tdtd className="px-6 py-4 text-sm text-white/40">{new Date(app.applied_at).toLocaleDateString()}</td>
                <<tdtd className="px-6 py-4">
                  <<divdiv className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block",
                    statusColors[app.status] || statusColors.applied
                  )}>
                    {app.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </tabletable>
      </div>
    </div>
  );
}
