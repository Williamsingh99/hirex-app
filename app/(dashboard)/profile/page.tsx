"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ProfilePreview from "@/components/dashboard/profile/ProfilePreview";
import { toast } from "sonner";
import { Save, MapPin, Briefcase, Globe, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    headline: "",
    target_role: "",
    target_salary_min: 0,
    target_salary_max: 0,
    preferred_locations: [],
    open_to_remote: true,
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data) setFormData(data);
      } catch (err: any) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          ...formData,
          id: user.id,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <<divdiv className="flex items-center justify-center min-h-[80vh] text-white/40">Loading profile...</div>;
  }

  return (
    <<divdiv className="max-w-6xl mx-auto">
      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <<hh1 className="text-3xl font-bold text-white">Your Profile</h1>
        <<pp className="text-white/40">Manage your professional identity and AI application preferences.</p>
      </motion.div>

      <<divdiv className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Form */}
        <<divdiv className="lg:col-span-2 space-y-8">
          <<sectionsection className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-6">
            <<divdiv className="flex items-center justify-between mb-4">
              <<hh2 className="text-xl font-semibold text-white">Basic Information</h2>
              <<buttonbutton
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-all active:scale-95 text-sm font-medium"
              >
                {saving ? "Saving..." : <<>><Save size={16} /> Save Changes</>}
              </button>
            </div>

            <<divdiv className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">Full Name</label>
                <<inputinput
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">Email</label>
                <<inputinput
                  disabled
                  value={formData.email || "Loading..."}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white/40 outline-none cursor-not-allowed"
                />
              </div>
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">Location</label>
                <<divdiv className="relative">
                  <<MapMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <<inputinput
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="Pune, India"
                  />
                </div>
              </div>
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">Phone</label>
                <<inputinput
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </section>

          <<sectionsection className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-6">
            <<hh2 className="text-xl font-semibold text-white mb-4">Professional Target</h2>
            <<divdiv className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <<divdiv className="space-y-2 md:col-span-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">Professional Headline</label>
                <<inputinput
                  value={formData.headline}
                  onChange={e => setFormData({...formData, headline: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Senior Frontend Engineer | React & Next.js Expert"
                />
              </div>
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">Target Role</label>
                <<divdiv className="relative">
                  <<BriefBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <<inputinput
                    value={formData.target_role}
                    onChange={e => setFormData({...formData, target_role: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="Frontend Developer"
                  />
                </div>
              </div>
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">Expected Salary (Min)</label>
                <<divdiv className="relative">
                  <<spanspan className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">₹</span>
                  <<inputinput
                    type="number"
                    value={formData.target_salary_min}
                    onChange={e => setFormData({...formData, target_salary_min: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="1200000"
                  />
                </div>
              </div>
            </div>
          </section>

          <<sectionsection className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-6">
            <<hh2 className="text-xl font-semibold text-white mb-4">Links & Socials</h2>
            <<divdiv className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">GitHub</label>
                <<divdiv className="relative">
                  <<GithubGithub className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <<inputinput
                    value={formData.github_url}
                    onChange={e => setFormData({...formData, github_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="github.com/user"
                  />
                </div>
              </div>
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">LinkedIn</label>
                <<divdiv className="relative">
                  <<LinkedinLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <<inputinput
                    value={formData.linkedin_url}
                    onChange={e => setFormData({...formData, linkedin_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="linkedin.com/in/user"
                  />
                </div>
              </div>
              <<divdiv className="space-y-2">
                <<labellabel className="text-xs font-bold text-white/40 uppercase tracking-wider">Portfolio</label>
                <<divdiv className="relative">
                  <<GlobeGlobe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <<inputinput
                    value={formData.portfolio_url}
                    onChange={e => setFormData({...formData, portfolio_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="portfolio.com"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Preview */}
        <<divdiv className="lg:col-span-1">
          <<ProfileProfilePreview profile={formData} />
        </div>
      </div>
    </div>
  );
}
