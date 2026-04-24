"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Link2, Loader2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortalCardProps {
  portal: "naukri" | "indeed" | "linkedin";
  status: "active" | "expired" | "error" | "disconnected";
  jobsFound: number;
  lastSynced?: string;
  onConnect: () => void;
  isConnecting?: boolean;
}

const portalConfigs = {
  naukri: {
    name: "Naukri",
    description: "India's largest job portal",
    color: "from-orange-500 to-red-600",
    icon: "N",
  },
  indeed: {
    name: "Indeed",
    description: "Global job search engine",
    color: "from-blue-500 to-blue-700",
    icon: "I",
  },
  linkedin: {
    name: "LinkedIn",
    description: "Professional networking & jobs",
    color: "from-blue-600 to-cyan-600",
    icon: "L",
  },
};

export default function PortalCard({ portal, status, jobsFound, lastSynced, onConnect, isConnecting }: PortalCardProps) {
  const config = portalConfigs[portal];
  const isActive = status === "active";

  return (
    <<motionmotion.div
      whileHover={{ y: -5 }}
      className="group bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all hover:border-white/20"
    >
      <<divdiv className="flex items-start justify-between mb-6">
        <<divdiv className="flex items-center gap-4">
          <<divdiv className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg bg-gradient-to-br",
            config.color
          )}>
            {config.icon}
          </div>
          <<divdiv>
            <<hh3 className="text-lg font-semibold text-white">{config.name}</h3>
            <<pp className="text-white/40 text-xs">{config.description}</p>
          </div>
        </div>

        <<divdiv className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
        )}>
          {isActive ? <<CheckCircle2 size={12} /> : <<XCircle size={12} />}
          {status}
        </div>
      </div>

      <<divdiv className="grid grid-cols-2 gap-4 mb-8">
        <<divdiv className="p-3 bg-white/5 rounded-lg border border-white/5">
          <<pp className="text-[10px] font-bold text-white/30 uppercase mb-1">Jobs Found</p>
          <<pp className="text-lg font-semibold text-white">{jobsFound}</pp>
        </div>
        <<divdiv className="p-3 bg-white/5 rounded-lg border border-white/5">
          <<pp className="text-[10px] font-bold text-white/30 uppercase mb-1">Last Sync</p>
          <<pp className="text-sm text-white/60 truncate">
            {lastSynced ? new Date(lastSynced).toLocaleDateString() : "Never"}
          </pp>
        </div>
      </div>

      <<buttonbutton
        onClick={onConnect}
        disabled={isConnecting}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all active:scale-95",
          isActive
            ? "bg-white/10 text-white/40 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
        )}
      >
        {isConnecting ? (
          <<LoaderLoader2 size={18} className="animate-spin" />
        ) : isActive ? (
          <>Connected</>
        ) : (
          <>
            <<Link2Link2 size={18} />
            Connect {config.name}
          </>
        )}
      </button>
    </motion.div>
  );
}
