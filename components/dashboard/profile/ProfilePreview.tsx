import React from "react";
import { User, MapPin, Briefcase, Globe, Github, Linkedin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePreviewProps {
  profile: any;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-white/10 mb-4" />
        <h3 className="text-xl font-bold text-white">{profile?.full_name || "Your Name"}</h3>
        <p className="text-white/40 text-sm">{profile?.headline || "Your professional headline"}</p>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-3 text-white/60">
          <MapPin size={16} className="text-blue-500" />
          <span>{profile?.location || "Location not set"}</span>
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <Briefcase size={16} className="text-blue-500" />
          <span>{profile?.target_role || "Target Role"}</span>
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <DollarSign size={16} className="text-blue-500" />
          <span>
            {profile?.target_salary_min ? `₹${profile.target_salary_min.toLocaleString()}` : "Salary range not set"}
          </span>
        </div>
        <div className="flex items-center justify-center gap-4 pt-6">
          <a href={profile?.github_url} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <Github size={18} />
          </a>
          <a href={profile?.linkedin_url} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <Linkedin size={18} />
          </a>
          <a href={profile?.portfolio_url} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <Globe size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
