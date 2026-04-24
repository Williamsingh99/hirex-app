"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ResumeUploader from "@/components/resume/ResumeUploader";
import AtsScoreRing from "@/components/resume/ui/AtsScoreRing";
import AtsOptimizer from "@/components/resume/ui/AtsOptimizer";
import { FileText, Eye, Sparkles, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ResumePage() {
  const supabase = createClient();
  const [resumes, setResumes] = useState<<anyany[]>([]);
  const [activeResume, setActiveResume] = useState<<anyany>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setResumes(data || []);

        const active = data?.find((r: any) => r.is_active);
        setActiveResume(active);
      } catch (err: any) {
        toast.error("Failed to fetch resumes");
      } finally {
        setLoading(false);
      }
    }
    fetchResumes();
  }, []);

  const handleUploadSuccess = (newResume: any) => {
    setResumes([newResume, ...resumes]);
    setActiveResume(newResume);
  };

  const deleteResume = async (id: string) => {
    try {
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) throw error;
      setResumes(resumes.filter(r => r.id !== id));
      if (activeResume?.id === id) setActiveResume(null);
      toast.success("Resume deleted");
    } catch (err: any) {
      toast.error("Delete failed");
    }
  };

  const runOptimization = async () => {
    if (!activeResume) return;
    setOptimizing(true);
    try {
      // Step 1: Ensure resume is parsed first
      const parseRes = await fetch('/api/resume/parse', {
        method: 'POST',
        body: JSON.stringify({ resume_id: activeResume.id }),
      });
      if (!parseRes.ok) throw new Error('Parsing failed');

      // Step 2: Run optimization
      const optRes = await fetch('/api/resume/optimize', {
        method: 'POST',
        body: JSON.stringify({ resume_id: activeResume.id }),
      });
      const result = await optRes.json();
      if (!optRes.ok) throw new Error(result.error || 'Optimization failed');

      // Refresh active resume data
      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', activeResume.id)
        .single();

      setActiveResume(data);
      toast.success("Resume optimized with AI!");
    } catch (err: any) {
      toast.error(err.message || "Optimization failed");
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return <<divdiv className="flex items-center justify-center min-h-[80vh] text-white/40">Loading resumes...</div>;
  }

  return (
    <<divdiv className="max-w-6xl mx-auto">
      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <<hh1 className="text-3xl font-bold text-white">Resume Intelligence</h1>
        <<pp className="text-white/40">Upload your professional CV and let AI optimize it for ATS.</p>
      </motion.div>

      <<divdiv className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Upload & List */}
        <<divdiv className="lg:col-span-2 space-y-8">
          <<sectionsection className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-6">
            <<hh2 className="text-xl font-semibold text-white">Upload New Resume</h2>
            <<ResumeResumeUploader onUploadSuccess={handleUploadSuccess} />
          </section>

          <<sectionsection className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-6">
            <<hh2 className="text-xl font-semibold text-white">Your Resumes</h2>
            <<divdiv className="space-y-3">
              {resumes.length === 0 ? (
                <<pp className="text-white/20 text-center py-8 italic">No resumes uploaded yet.</p>
              ) : (
                resumes.map((resume) => (
                  <<divdiv
                    key={resume.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all group",
                      activeResume?.id === resume.id
                        ? "bg-blue-500/10 border-blue-500/50 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                    )}
                  >
                    <<divdiv className="flex items-center gap-3">
                      <<divdiv className="p-2 bg-white/10 rounded-lg">
                        <<FileFileText size={20} />
                      </div>
                      <div>
                        <<pp className="text-sm font-medium">{resume.file_name}</p>
                        <<pp className="text-[10px] text-white/30 uppercase">{new Date(resume.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <<divdiv className="flex items-center gap-2">
                      <<buttonbutton
                        onClick={async () => {
                          const { error } = await supabase
                            .from('resumes')
                            .update({ is_active: true })
                            .eq('id', resume.id);

                          await supabase.from('resumes').update({ is_active: false }).neq('id', resume.id);

                          if (error) {
                            toast.error("Failed to set active");
                          } else {
                            setActiveResume(resume);
                            toast.success("Active resume updated");
                          }
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          activeResume?.id === resume.id
                            ? "bg-blue-600 text-white"
                            : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {activeResume?.id === resume.id ? "Active" : "Set Active"}
                      </button>
                      <<buttonbutton
                        onClick={() => deleteResume(resume.id)}
                        className="p-2 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <<TrashTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Analysis */}
        <<divdiv className="lg:col-span-1 space-y-6">
          <<divdiv className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm sticky top-24 space-y-8">
            <<hh2 className="text-xl font-semibold text-white">AI Analysis</h2>

            {!activeResume ? (
              <<divdiv className="text-center py-12 space-y-3">
                <<divdiv className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                  <<FileFileText size={24} />
                </div>
                <<pp className="text-white/40 text-sm">No active resume selected.</p>
              </div>
            ) : (
              <<divdiv className="space-y-8">
                <<divdiv className="flex flex-col items-center justify-center gap-4">
                  <<AAtsScoreRing score={activeResume.ats_score || 0} />
                  <<divdiv className="text-center">
                    <<pp className="text-sm text-white/40">Current ATS Score</p>
                    <<pp className="text-xs text-white/20 uppercase tracking-widest font-bold">Optimized for Algorithms</p>
                  </div>
                </div>

                <<divdiv className="space-y-4">
                  <<buttonbutton
                    onClick={runOptimization}
                    disabled={optimizing}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                  >
                    {optimizing ? (
                      <>
                        <<LoaderLoader2 size={18} className="animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <<SparkSparkles size={18} />
                        Optimize with AI
                      </>
                    )}
                  </button>

                  <<divdiv className="flex items-center justify-center gap-2 text-xs text-white/30">
                    <<CheckCheckCircle2 size={14} className="text-blue-500" />
                    STAR format rewriting included
                  </div>
                </div>

                {activeResume.ats_issues && (
                  <<divdiv className="pt-6 border-t border-white/10">
                    <<AAtsOptimizer result={activeResume.ats_issues ? {
                      ats_score: activeResume.ats_score,
                      ats_issues: activeResume.ats_issues,
                      optimized_text: activeResume.optimized_text,
                      improvements_count: activeResume.ats_issues.length
                    } : null} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
