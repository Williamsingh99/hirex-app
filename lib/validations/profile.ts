import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  target_role: z.string().min(2, "Target role must be at least 2 characters").max(100),
  years_experience: z.number().min(0).max(50),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  github_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  portfolio_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const jobSyncSchema = z.object({
  keywords: z.string().min(2, "Keywords must be at least 2 characters"),
  location: z.string().optional(),
  maxJobs: z.number().min(1).max(50).optional().default(20),
});
