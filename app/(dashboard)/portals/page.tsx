// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Link2,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import PortalCard from "@/components/portals/PortalCard";
import { toast } from "sonner";

export default function PortalsPage() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const mockPortals: any[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      status: 'connected',
      last_sync: '12 mins ago',
      type: 'Professional Network',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      icon: 'LinkedIn'
    },
    {
      id: 'indeed',
      name: 'Indeed',
      status: 'connected',
      last_sync: '1 hour ago',
      type: 'Job Board',
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10',
      icon: 'Indeed'
    },
    {
      id: 'naukri',
      name: 'Naukri',
      status: 'error',
      last_sync: '3 days ago',
      type: 'Regional Job Board',
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
      icon: 'Naukri'
    },
    {
      id: 'glassdoor',
      name: 'Glassdoor',
      status: 'disconnected',
      last_sync: 'Never',
      type: 'Company Reviews',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      icon: 'Glassdoor'
    },
  ];

  const handleSync = async (id: string) => {
    setSyncing(id);
    toast.info(`Syncing with ${id}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncing(null);
    toast.success(`${id} successfully synced`);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Connection Matrix</h1>
          <p className="text-white/40">Securely bridge your professional identity across job portals.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            Encrypted Connection
          </div>
        </div>
      </div>

      {/* Portal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 w-full bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
          ))
        ) : (
          mockPortals.map((portal) => (
            <PortalCard
              key={portal.id}
              portal={portal}
              isSyncing={syncing === portal.id}
              onSync={() => handleSync(portal.id)}
            />
          ))
        )}
      </div>

      {/* Security & Encryption Section */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-6 relative overflow-hidden group">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all" />

        <div className="flex items-center gap-3 mb-2">
          <Lock className="text-blue-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Security Protocol</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
              <CheckCircle2 size={16} className="text-emerald-400" />
              AES-256 Encryption
            </div>
            <p className="text-xs text-white/30">Your credentials are encrypted and never stored in plain text.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
              <CheckCircle2 size={16} className="text-emerald-400" />
              OAuth 2.0 Handshake
            </div>
            <p className="text-xs text-white/30">We use secure token-based authentication for all portal connections.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Zero-Knowledge Architecture
            </div>
            <p className="text-xs text-white/30">We cannot access your private accounts without an active session token.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
