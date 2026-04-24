"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import PortalCard from "@/components/portals/PortalCard";
import { toast } from "sonner";
import { Link2, ShieldCheck } from "lucide-react";

export default function PortalsPage() {
  const supabase = createClient();
  const [connections, setConnections] = useState<<anyany[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingPortal, setConnectingPortal] = useState<<string | null>(null);

  useEffect(() => {
    async function fetchConnections() {
      try {
        const { data, error } = await supabase
          .from("portal_connections")
          .select("*");

        if (error) throw error;
        setConnections(data || []);
      } catch (err: any) {
        toast.error("Failed to load portal connections");
      } finally {
        setLoading(false);
      }
    }
    fetchConnections();
  }, []);

  const handleConnect = async (portal: "naukri" | "indeed" | "linkedin") => {
    setConnectingPortal(portal);
    try {
      // This is a frontend trigger. The actual OAuth/Credential flow
      // will be handled in Day 9 and 12. For now, we implement the UI trigger.
      toast.info(`Initiating connection to ${portal}...`);

      // Simulate connection flow for now
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real scenario, we'd redirect to OAuth or open a modal for credentials
      toast.success(`${portal} connected successfully!`);

      // Refresh connections
      const { data } = await supabase
        .from("portal_connections")
        .select("*");
      setConnections(data || []);
    } catch (err: any) {
      toast.error(`Failed to connect to ${portal}`);
    } finally {
      setConnectingPortal(null);
    }
  };

  if (loading) {
    return <<divdiv className="flex items-center justify-center min-h-[80vh] text-white/40">Loading portals...</div>;
  }

  return (
    <<divdiv className="max-w-6xl mx-auto">
      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <<hh1 className="text-3xl font-bold text-white">Portal Connections</h1>
        <<pp className="text-white/40">Connect your job portals to enable AI auto-discovery and application.</p>
      </motion.div>

      <<divdiv className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {["naukri", "indeed", "linkedin"].map((portal) => {
          const connection = connections.find(c => c.portal === portal);
          return (
            <<PortalCard
              key={portal}
              portal={portal as any}
              status={connection?.status || "disconnected"}
              jobsFound={connection?.jobs_found || 0}
              lastSynced={connection?.last_synced_at}
              onConnect={() => handleConnect(portal as any)}
              isConnecting={connectingPortal === portal}
            />
          );
        })}
      </div>
    </div>
  );
}
