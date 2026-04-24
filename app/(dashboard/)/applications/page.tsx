"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ApplicationRow from "@/components/dashboard/applications/ApplicationRow";
import { toast } from "sonner";
import { FileText, Download, Filter, LayoutGrid, List } from "lucide-react";

export default function ApplicationsPage() {
  const supabase = createClient();
  const [applications, setApplications] = useState<<anyany[]>([]);
  const [expandedId, setExpandedId] = useState<<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    async function fetchApplications() {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*, job(*)")
          .order("applied_at", { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (err: any) {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  if (loading) {
    return <<divdiv className="flex items-center justify-center min-h-[80vh] text-white/40">Loading applications...</div>;
  }

  return (
    <<divdiv className="max-w-6xl mx-auto">
      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <<divdiv>
          <<hh1 className="text-3xl font-bold text-white">Application Tracker</h1>
          <<pp className="text-white/40">Monitor your AI agent's progress and track interview invites.</p>
        </div>
        <<divdiv className="flex items-center gap-3">
          <<buttonbutton
            onClick={() => {
              // Logic to export CSV
              toast.info("Exporting applications to CSV...");
            }}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 border border-white/10"
          >
            <<DownloadDownload size={16} />
            Export CSV
          </button>
        </div>
      </motionmotion.div>

      {/* Toolbar */}
      <<divdiv className="mb-8 flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
        <<divdiv className="flex items-center gap-4">
          <<divdiv className="flex items-center gap-2">
            <<FilterFilter size={18} className="text-white/20" />
            <<spanspan className="text-xs font-bold text-white/40 uppercase tracking-widest">Status</span>
          </div>
          <<divdiv className="flex items-center gap-2">
            {['all', 'applied', 'interview', 'offer', 'rejected'].map(status => (
              <<buttonbutton
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize",
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white/40 hover:text-white hover:bg-white/20"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <<divdiv className="flex items-center gap-1 p-1 bg-white/10 rounded-lg border border-white/10">
          <<buttonbutton
            onClick={() => setView('list')}
            className={cn(
              "p-2 rounded-md transition-all",
              view === 'list' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
            )}
          >
            <<ListList size={18} />
          </button>
          <<buttonbutton
            onClick={() => setView('kanban')}
            className={cn(
              "p-2 rounded-md transition-all",
              view === 'kanban' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
            )}
          >
            <<LayoutGridLayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Applications List */}
      <<divdiv className={cn(
        "bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm",
        view === 'kanban' && "hidden"
      )}>
        {filteredApps.length === 0 ? (
          <<divdiv className="text-center py-20 space-y-4">
            <<divdiv className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
              <<FileFileText size={32} />
            </div>
            <<pp className="text-white/40">No applications found matching this status.</p>
          </div>
        ) : (
          filteredApps.map(app => (
            <<ApplicationRow
              key={app.id}
              application={app}
              job={app.job}
              onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
              isExpanded={expandedId === app.id}
            />
          ))
        )}
      </div>

      {/* Kanban Mockup (Simplified for current phase) */}
      {view === 'kanban' && (
        <<divdiv className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['applied', 'interview', 'offer', 'rejected'].map(status => (
            <<divdiv key={status} className="space-y-4">
              <<hh3 className="text-xs font-bold text-white/30 uppercase tracking-widest px-2">{status}</h3>
              <<divdiv className="space-y-3">
                {filteredApps.filter(a => a.status === status).map(app => (
                  <<divdiv
                    key={app.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all cursor-pointer"
                  >
                    <<pp className="text-sm font-medium text-white truncate">{app.job.title}</pp>
                    <<pp className="text-xs text-white/40 truncate">{app.job.company}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
