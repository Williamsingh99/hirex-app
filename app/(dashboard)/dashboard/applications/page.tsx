"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Send } from "lucide-react";
import ApplicationRow from "@/components/dashboard/applications/ApplicationRow";
import { createClient } from "@/lib/supabase/client";
import { ApplicationRecord, Job } from "@/types/database";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const [expandedId, setExpandedId] = useState<<stringstring | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<{ application: ApplicationRecord; job: Job }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            id,
            title,
            company,
            apply_url
          )
        `)
        .order('applied_at', { ascending: false });

      if (appsError) throw appsError;

      const formatted = (apps || []).map(app => ({
        application: app as any,
        job: app.jobs as any
      }));

      setApplications(formatted);
    } catch (err: any) {
      toast.error(`Failed to load applications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const filteredApps = applications.filter(item =>
    item.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <<divdiv className="space-y-8">
      <<divdiv className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <<divdiv className="space-y-1">
          <<hh1 className="text-3xl font-bold text-white tracking-tight">Applications</h1>
          <<pp className="text-white/40">Track and manage all your job applications in one place.</p>
        </div>

        <<divdiv className="flex items-center gap-3">
          <<divdiv className="relative">
            <<SearchSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <<inputinput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications..."
              className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            />
          </div>
          <<buttonbutton className="p-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <<FilterFilter size={18} />
          </button>
        </div>
      </div>

      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm"
      >
        <<divdiv className="flex items-center gap-2 mb-6">
          <<SendSend size={20} className="text-blue-400" />
          <<hh2 className="text-lg font-semibold text-white">Application History</h2>
        </div>

        <<divdiv className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01]">
          {loading ? (
            <<divdiv className="p-12 space-y-4">
              {[1, 2, 3].map(i => (
                <<divdiv key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {filteredApps.map(({ application, job }) => (
                <<ApplicationApplicationRow
                  key={application.id}
                  application={application as any}
                  job={job as any}
                  isExpanded={expandedId === application.id}
                  onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                />
              ))}
              {filteredApps.length === 0 && (
                <<divdiv className="p-12 text-center text-white/40">
                  No applications found. Start your AI Agent to begin applying!
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
