export type Portal = 'naukri' | 'indeed' | 'linkedin';
export type ApplicationStatus =
  'applied' | 'viewed' | 'shortlisted' | 'interview' | 'rejected' | 'offer';
export type MessageType =
  'interview_invite' | 'rejection' | 'offer' | 'general';
export type PlanType = 'free' | 'pro' | 'enterprise';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  headline?: string;
  target_role?: string;
  target_salary_min?: number;
  target_salary_max?: number;
  preferred_locations: string[];
  open_to_remote: boolean;
  plan: PlanType;
  auto_apply_enabled: boolean;
  daily_apply_limit: number;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  raw_text?: string;
  parsed_data?: ParsedResume;
  ats_score?: number;
  ats_issues?: ATSIssue[];
  optimized_text?: string;
  is_active: boolean;
  version: number;
  created_at: string;
}

export interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  languages: string[];
}

export interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  start_date?: string;
  end_date?: string;
  bullets: string[];
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
}

export interface ATSIssue {
  type: 'missing_keyword' | 'weak_bullet' | 'format_issue' | 'length_issue';
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
  original?: string;
  improved?: string;
}

export interface JobListing {
  id: string;
  portal: Portal;
  portal_job_id: string;
  title: string;
  company: string;
  location?: string;
  is_remote: boolean;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  description: string;
  required_skills: string[];
  experience_required?: string;
  employment_type?: string;
  posted_at?: string;
  apply_url?: string;
}

export interface JobMatch {
  id: string;
  user_id: string;
  job_id: string;
  job: JobListing;
  match_score: number;
  skill_match_pct: number;
  experience_match: boolean;
  salary_match: boolean;
  location_match: boolean;
  missing_skills: string[];
  match_reason: string;
  status: 'pending' | 'queued' | 'applied' | 'skipped';
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  job?: JobListing;
  portal: Portal;
  resume_id: string;
  cover_letter?: string;
  applied_via: 'auto' | 'manual';
  status: ApplicationStatus;
  applied_at: string;
  notes?: string;
}

export interface RecruiterMessage {
  id: string;
  user_id: string;
  application_id?: string;
  application?: Application;
  portal: string;
  sender_name: string;
  sender_email: string;
  sender_company?: string;
  subject: string;
  body: string;
  message_type: MessageType;
  ai_summary: string;
  suggested_reply?: string;
  is_read: boolean;
  received_at: string;
}

export interface DashboardStats {
  total_applied: number;
  applied_today: number;
  interviews_scheduled: number;
  offers_received: number;
  unread_messages: number;
  ats_score: number;
  match_rate: number;
  portals_connected: number;
}
