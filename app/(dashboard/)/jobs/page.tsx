"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import JobMatchCard from "@/components/dashboard/jobs/JobMatchCard";
import { toast } from "sonner";
import { Filter, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JobsPage() {
  const supabase = createClient();
  const [matches, setMatches] = useState<<anyany[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minScore: 0,
    remoteOnly: false,
    portal: "all",
  });

  useEffect(() => {
    async function fetchMatches() {
      try {
        const { data, error } = await supabase
          .from("job_matches")
          .select("*, job(*)")
          .order("match_score", { ascending: false });

        if (error) throw error;
        setMatches(data || []);
      } catch (err: any) {
        toast.error("Failed to load job matches");
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  const handleQueue = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from("job_matches")
        .update({ status: "queued" })
        .eq("id", matchId);

      if (error) throw error;
      setMatches(matches.map(m => m.id === matchId ? { ...m, status: "queued" } : m));
      toast.success("Job added to auto-apply queue");
    } catch (err: any) {
      toast.error("Failed to queue job");
    }
  };

  const handleSkip = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from("job_matches")
        .update({ status: "skipped" })
        .eq("id", matchId);

      if (error) throw error;
      setMatches(matches.map(m => m.id === matchId ? { ...m, status: "queued" } : m));
      toast.success("Job skipped");
    } catch (err: any) {
      toast.error("Failed to skip job");
    }
  };

  const filteredMatches = matches.filter(m => {
    const scoreOk = m.match_score >= filters.minScore;
    const remoteOk = !filters.remoteOnly || m.job.is_remote;
    const portalOk = filters.portal === "all" || m.job.portal === filters.portal;
    return scoreOk && remoteOk && portalOk;
  });

  if (loading) {
    return <<divdiv className="flex items-center justify-center min-h-[80vh] text-white/40">Loading matches...</div>;
  }

  return (
    <<divdiv className="max-w-6xl mx-auto">
      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <<divdiv>
          <<hh1 className="text-3xl font-bold text-white">AI Job Matches</h1>
          <<pp className="text-white/40">Jobs tailored to your active resume and target role.</p>
        </div>
        <<divdiv className="flex items-center gap-3 bg-white/5 border border-white/10 p-1 rounded-xl">
          <<buttonbutton
            onClick={() => {
              // This would trigger the /api/jobs/rank route
              toast.info("Updating match scores...");
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
          >
            <<SparklesSparkles size={16} />
            Refresh Matches
          </button>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <<divdiv className="mb-8 flex flex-wrap items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
        <<divdiv className="flex items-center gap-3">
          <<FilterFilter size={18} className="text-white/20" />
          <<spanspan className="text-xs font-bold text-white/40 uppercase tracking-widest">Filters</span>
        </div>
        <<divdiv className="h-6 w-[1px] bg-white/10 mx-2" />
        <<divdiv className="flex flex-wrap items-center gap-3">
          <<divdiv className="flex items-center gap-2">
            <<spanspan className="text-xs text-white/40">Min Score</span>
            <<selectselect
              value={filters.minScore}
              onChange={e => setFilters({...filters, minScore: parseInt(e.target.value)})}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <<optionoption value="0">Any</option>
              <<optionoption value="70">70%+</option>
              <<optionoption value="80">80%+</option>
              <<optionoption value="90">90%+</option>
            </select>
          </div>
          <<divdiv className="flex items-center gap-2">
            <<spanspan className="text-xs text-white/40">Remote</span>
            <<buttonbutton
              onClick={() => setFilters({...filters, remoteOnly: !filters.remoteOnly})}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium transition-all",
                filters.remoteOnly ? "bg-blue-600 text-white" : "bg-white/10 text-white/40"
              )}
            >
              Remote Only
            </button>
          </div>
          <<divdiv className="flex items-center gap-2">
            <<spanspan className="text-xs text-white/40">Portal</span>
            <<selectselect
              value={filters.portal}
              onChange={e => setFilters({...filters, portal: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <<optionoption value="all">All Portals</option>
              <<optionoption value="linkedin">LinkedIn</option>
              <<optionoption value="indeed">Indeed</option>
              <<optionoption value="naukri">Naukri</option>
            </select>
          </div>
        </div>
      </div>

      {/* Masonry-like Grid */}
      <<divdiv className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.length === 0 ? (
          <<divdiv className="col-span-full text-center py-20 space-y-4">
            <<divdiv className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
              <<SearchSearch size={32} />
            </div>
            <<pp className="text-white/40 text-center max-w-md mx-auto">
              No jobs matching your criteria. Try adjusting filters or refreshing matches.
            </pp>
          </div>
        ) : (
          filteredMatches.map(match => (
            <<JobMatchCard
              key={match.id}
              match={match}
              job={match.job}
              onQueue={() => handleQueue(match.id)}
              onSkip={() => handleSkip(match.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
