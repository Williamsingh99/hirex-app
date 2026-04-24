"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ProfilePreview from "@/components/dashboard/profile/ProfilePreview";
import { toast } from "sonner";
import {
  Save,
  MapPin,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  User,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
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
    return <div className="flex items-center justify-center min-h-[80vh] text-white/40">Loading identity hub...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Professional Identity Hub</h1>
          <p className="text-white/40">Define your AI persona and target roles for maximum match rates.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-3 rounded-full transition-all active:scale-95 text-sm font-bold shadow-lg shadow-blue-600/20"
        >
          {saving ? "Syncing..." : <><Save size={18} /> Sync Identity</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Management Tabs/Sections */}
        <div className="lg:col-span-7 space-y-8">

          {/* Basic Identity Card */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <User size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white">Core Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Full Name</label>
                <input
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <input
                    disabled
                    value={formData.email || "Loading..."}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white/40 outline-none cursor-not-allowed"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                    placeholder="Pune, India"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Phone</label>
                <input
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </section>

          {/* Target Persona Card */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Target size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white">Target Persona</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Professional Headline</label>
                <input
                  value={formData.headline}
                  onChange={e => setFormData({...formData, headline: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                  placeholder="Senior Frontend Engineer | React & Next.js Expert"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Target Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      value={formData.target_role}
                      onChange={e => setFormData({...formData, target_role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                      placeholder="Frontend Developer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Expected Salary (Min)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">₹</span>
                    <input
                      type="number"
                      value={formData.target_salary_min}
                      onChange={e => setFormData({...formData, target_salary_min: parseInt(e.target.value) || 0})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                      placeholder="1200000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Digital Presence Card */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Globe size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white">Digital Presence</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">GitHub</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    value={formData.github_url}
                    onChange={e => setFormData({...formData, github_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                    placeholder="github.com/user"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    value={formData.linkedin_url}
                    onChange={e => setFormData({...formData, linkedin_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                    placeholder="linkedin.com/in/user"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Portfolio</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    value={formData.portfolio_url}
                    onChange={e => setFormData({...formData, portfolio_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                    placeholder="portfolio.com"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Real-time Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Sparkles size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">AI Live Preview</span>
              </div>
              <ProfilePreview profile={formData} />
              <div className="pt-6 flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>ATS Validated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>Auto-syncing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
