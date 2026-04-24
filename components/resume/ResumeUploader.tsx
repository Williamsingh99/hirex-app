"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ResumeUploaderProps {
  onUploadSuccess: (resume: any) => void;
}

export default function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const uploadFile = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // 1. Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      // 3. Save metadata to resumes table
      const { data: resumeData, error: dbError } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          is_active: true,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success("Resume uploaded successfully");
      onUploadSuccess(resumeData);
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative group border-2 border-dashed transition-all duration-200 rounded-2xl p-12 text-center cursor-pointer",
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
        )}
      >
        <input {...getInputProps()} />

        {!file ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-white font-medium">Drop your resume here</p>
              <p className="text-white/40 text-sm">PDF only, max 5MB</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                <FileText size={20} />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-white/40 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="p-1 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            onClick={uploadFile}
            disabled={isUploading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl transition-all active:scale-95 font-medium"
          >
            {isUploading ? "Uploading..." : <><CheckCircle2 size={18} /> Upload Resume</>}
          </button>
        </motion.div>
      )}
    </div>
  );
}
