"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, ExternalLink, FileText, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ApplicationRowProps {
  application: any;
  job: any;
  onExpand: (id: string) => void;
  isExpanded: boolean;
}

export default function ApplicationRow({ application, job, onExpand, isExpanded }: ApplicationRowProps) {
  const statusColors: Record<string, string> = {
    applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    viewed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    shortlisted: "bg-green-500/10 text-green-400 border-green-500/20",
    interview: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const statusOptions = Object.keys(statusColors);

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/applications/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: application.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      toast.success(`Application moved to ${newStatus}`);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Error updating status');
    }
  };

  return (
    <div className="group border-b border-white/5 last:border-0">
      <div
        onClick={() => onExpand(application.id)}
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-white/5",
          isExpanded && "bg-white/10"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-white/40">
            <Briefcase size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white leading-tight truncate">{job.title}</p>
            <p className="text-xs text-white/40 truncate">{job.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-xs text-white/40">
            <Calendar size={14} />
            {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'Unknown'}
          </div>
          <div className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            statusColors[application.status] || statusColors.applied
          )}>
            {application.status || 'applied'}
          </div>
          <div className="w-4 h-4 flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
            <span className="text-lg leading-none">▾</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden bg-white/[0.02] border-t border-white/5"
        >
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Application Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-white/40 text-xs">Portal</p>
                  <p className="text-white font-medium capitalize">{application.portal_name || application.portal || 'Unknown'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 text-xs">Via</p>
                  <p className="text-white font-medium capitalize">{application.applied_via || 'Manual'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 text-xs">Resume Version</p>
                  <p className="text-white font-medium">v{application.resume_version || '1'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 text-xs">Last Updated</p>
                  <p className="text-white font-medium">{application.updated_at ? new Date(application.updated_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.filter(s => s !== application.status).map(status => (
                    <button
                      key={status}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(status);
                      }}
                      className="px-2 py-1 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={job.apply_url}
                target="_blank"
                className="inline-flex items-center gap-2 text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                <ExternalLink size={14} /> View original listing
              </a>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">AI Generated Cover Letter</h4>
                <button className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
                  <Mail size={14} />
                </button>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 leading-relaxed italic">
                {application.cover_letter || "No cover letter generated for this application."}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
