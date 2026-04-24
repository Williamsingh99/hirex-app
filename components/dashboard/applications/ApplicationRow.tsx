"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, ExternalLink, FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <<divdiv className="group border-b border-white/5 last:border-0">
      <<divdiv
        onClick={() => onExpand(application.id)}
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-white/5",
          isExpanded && "bg-white/10"
        )}
      >
        <<divdiv className="flex items-center gap-4">
          <<divdiv className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-white/40">
            <<BriefcaseBriefcase size={18} />
          </div>
          <<divdiv>
            <<pp className="text-sm font-medium text-white leading-tight">{job.title}</pp>
            <<pp className="text-xs text-white/40">{job.company}</p>
          </div>
        </div>

        <<divdiv className="flex items-center gap-6">
          <<divdiv className="hidden md:flex items-center gap-2 text-xs text-white/40">
            <<CalendarCalendar size={14} />
            {new Date(application.applied_at).toLocaleDateString()}
          </div>
          <<divdiv className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            statusColors[application.status] || statusColors.applied
          )}>
            {application.status}
          </div>
          <<divdiv className="w-4 h-4 flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
            <span className="text-lg leading-none">▾</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <<motionmotion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden bg-white/[0.02] border-t border-white/5"
        >
          <<divdiv className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <<divdiv className="space-y-4">
              <<hh4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Application Details</h4>
              <<divdiv className="grid grid-cols-2 gap-4 text-sm">
                <<divdiv>
                  <<pp className="text-white/40 text-xs">Portal</p>
                  <<pp className="text-white font-medium capitalize">{application.portal}</pp>
                </div>
                <<divdiv>
                  <<pp className="text-white/40 text-xs">Via</p>
                  <<pp className="text-white font-medium capitalize">{application.applied_via}</pp>
                </div>
                <<divdiv>
                  <<pp className="text-white/40 text-xs">Resume Version</p>
                  <<pp className="text-white font-medium">v{application.resume_version || '1'}</pp>
                </div>
                <<divdiv>
                  <<pp className="text-white/40 text-xs">Status Update</p>
                  <<pp className="text-white font-medium">{new Date(application.last_status_update).toLocaleDateString()}</pp>
                </div>
              </div>
              <<aa
                href={job.apply_url}
                target="_blank"
                className="inline-flex items-center gap-2 text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                <<ExternalExternalLink size={14} /> View original listing
              </a>
            </div>

            <<divdiv className="space-y-4">
              <<divdiv className="flex items-center justify-between">
                <<hh4 className="text-xs font-bold text-white/30 uppercase tracking-widest">AI Generated Cover Letter</h4>
                <<buttonbutton className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
                  <<MailMail size={14} />
                </button>
              </div>
              <<divdiv className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 leading-relaxed italic">
                {application.cover_letter || "No cover letter generated for this application."}
              </div>
            </div>
          </div>
        </motionmotion.div>
      )}
    </div>
  );
}
