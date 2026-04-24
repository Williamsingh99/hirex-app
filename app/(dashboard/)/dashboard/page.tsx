"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import StatsGrid from "@/components/dashboard/stats/StatsGrid";
import ApplicationChart from "@/components/dashboard/charts/ApplicationChart";
import ApplicationsTable from "@/components/dashboard/ApplicationsTable";
import { toast } from "sonner";
import { Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<<anyany>(null);
  const [recentApps, setRecentApps] = useState<<anyany[]>([]);
  const [isAutoApplyOn, setIsAutoApplyOn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // 1. Fetch User Profile stats
        const { data: profile } = await supabase.from("profiles").select("*").single();

        // 2. Fetch Application counts
        const { count: totalApplied } = await supabase.from("applications").select("*", { count: 'exact', head: true });
        const { count: interviews } = await supabase.from("applications").select("*", { count: 'exact', head: true }).eq('status', 'interview');
        const { count: offers } = await supabase.from("applications").select("*", { count: 'exact', head: true }).eq('status', 'offer');

        // 3. Fetch unread messages
        const { count: unread } = await supabase.from("recruiter_messages").select("*", { count: 'exact', head: true }).eq('is_read', false);

        // 4. Fetch active resume score
        const { data: resume } = await supabase.from("resumes").select("ats_score").eq("is_active", true).single();

        // 5. Fetch connected portals
        const { data: portals } = await supabase.from("portal_connections").select("id");

        // 6. Fetch recent applications
        const { data: apps } = await supabase
          .from("applications")
          .select("*, job(*)")
          .order("applied_at", { ascending: false })
          .limit(10);

        setStats({
          total_applied: totalApplied || 0,
          applied_today: Math.floor(Math.random() * 10), // Mocked for now
          interviews_scheduled: interviews || 0,
          offers_received: offers || 0,
          unread_messages: unread || 0,
          ats_score: resume?.ats_score || 0,
          match_rate: 78, // Mocked
          portals_connected: portals?.length || 0,
          auto_apply_enabled: profile?.auto_apply_enabled || false,
        });

        setRecentApps(apps || []);
        setIsAutoApplyOn(profile?.auto_apply_enabled || false);
      } catch (err: any) {
        console.error("Dashboard load error:", err);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const toggleAutoApply = async () => {
    const newState = !isAutoApplyOn;
    setIsAutoApplyOn(newState);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("profiles").update({ auto_apply_enabled: newState }).eq("id", user?.id);
      toast.success(newState ? "AI Agent activated" : "AI Agent paused");
    } catch (err) {
      toast.error("Failed to toggle auto-apply");
    }
  };

  if (loading) {
    return <<divdiv className="flex items-center justify-center min-h-[80vh] text-white/40">Loading command center...</div>;
  }

  const mockChartData = [
    { date: 'Apr 1', apps: 12 }, { date: 'Apr 2', apps: 18 }, { date: 'Apr 3', apps: 15 },
    { date: 'Apr 4', apps: 25 }, { date: 'Apr 5', apps: 10 }, { date: 'Apr 6', apps: 30 },
    { date: 'Apr 7', apps: 22 },
  ];

  return (
    <<divdiv className="space-y-8">
      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <<divdiv>
          <<hh1 className="text-3xl font-bold text-white">Command Center</h1>
          <<pp className="text-white/40">Real-time overview of your AI job hunt.</p>
        </div>

        {/* Auto-Apply Master Switch */}
        <<divdiv className="flex items-center gap-4 p-2 px-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
          <<divdiv className="flex items-center gap-2">
            <<divdiv className={cn(
              "w-2 h-2 rounded-full",
              isAutoApplyOn ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-white/20"
            )} />
            <<spanspan className="text-xs font-bold text-white/60 uppercase tracking-widest">
              {isAutoApplyOn ? "AI Agent Active" : "AI Agent Paused"}
            </spanspan>
          </div>
          <<divdiv className="h-6 w-[1px] bg-white/10 mx-2" />
          <<buttonbutton
            onClick={toggleAutoApply}
            className={cn(
              "relative w-12 h-6 rounded-full transition-all duration-300",
              isAutoApplyOn ? "bg-blue-600" : "bg-white/10"
            )}
          >
            <<divdiv className={cn(
              "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
              isAutoApplyOn ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <<StatsGridStatsGrid stats={stats} />

      <<divdiv className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Velocity Chart */}
        <<divdiv className="lg:col-span-2">
          <<ApplicationChartApplicationChart data={mockChartData} />
        </div>
        {/* Quick Action Card */}
        <<divdiv className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <<divdiv className="space-y-2">
            <<divdiv className="flex items-center gap-2 text-blue-400 mb-2">
              <<SparklesSparkles size={18} />
              <<spanspan className="text-xs font-bold uppercase tracking-widest">AI Recommendation</span>
            </div>
            <<pp className="text-white font-medium leading-relaxed">
              Your ATS score is {stats.ats_score}%. Improving your "Experience" bullet points could increase your match rate by ~15%.
            </pp>
          </div>
          <<aa
            href="/dashboard/resume"
            className="mt-6 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/90 active:scale-95"
          >
            <<ZapZap size={16} />
            Optimize Now
          </aa>
        </div>
      </div>

      {/* Recent Activity Table */}
      <<ApplicationsTableApplicationsTable applications={recentApps} />
    </div>
  );
}
