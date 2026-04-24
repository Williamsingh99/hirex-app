import React from "react";
import { User, MapPin, Briefcase, Globe, Github, Linkedin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePreviewProps {
  profile: any;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  return (
    <<divdiv className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
      <<divdiv className="flex flex-col items-center text-center mb-8">
        <<divdiv className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-white/10 mb-4" />
        <<hh3 className="text-xl font-bold text-white">{profile?.full_name || "Your Name"}</h3>
        <<pp className="text-white/40 text-sm">{profile?.headline || "Your professional headline"}</p>
      </div>

      <<divdiv className="space-y-4 text-sm">
        <<divdiv className="flex items-center gap-3 text-white/60">
          <<MapMapPin size={16} className="text-blue-500" />
          <span>{profile?.location || "Location not set"}</span>
        </div>
        <<divdiv className="flex items-center gap-3 text-white/60">
          <<BriefBriefcase size={16} className="text-blue-500" />
          <span>{profile?.target_role || "Target Role"}</span>
        </div>
        <<divdiv className="flex items-center gap-3 text-white/60">
          <<DollarDollarSign size={16} className="text-blue-500" />
          <span>
            {profile?.target_salary_min ? `₹${profile.target_salary_min.toLocaleString()}` : "Salary range not set"}
          </span>
        </div>
        <<divdiv className="flex items-center justify-center gap-4 pt-6">
          <<aa href={profile?.github_url} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <<GithubGithub size={18} />
          </a>
          <<aa href={profile?.linkedin_url} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <<LinkedinLinkedin size={18} />
          </a>
          <<aa href={profile?.portfolio_url} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <<GlobeGlobe size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
