export type PortalName = 'naukri' | 'indeed' | 'linkedin' | 'glassdoor' | 'monster';

export interface PortalConnection {
  id: string;
  user_id: string;
  portal_name: PortalName;
  api_key?: string;
  access_token?: string;
  refresh_token?: string;
  status: 'connected' | 'disconnected' | 'error';
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  portal_name: PortalName;
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
  created_at: string;
}

export type ApplicationStatus = 'Queued' | 'Applied' | 'Interviewing' | 'Rejected';

export interface ApplicationRecord {
  id: string;
  user_id: string;
  job_id: string;
  portal_name: PortalName;
  resume_id?: string;
  cover_letter?: string;
  applied_via: 'auto' | 'manual';
  status: ApplicationStatus;
  applied_at: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type MessageType = 'interview_invite' | 'rejection' | 'follow_up' | 'general';

export interface MessageRecord {
  id: string;
  user_id: string;
  application_id?: string;
  portal_name: PortalName;
  sender_name: string;
  sender_email: string;
  sender_company?: string;
  subject: string;
  body: string;
  message_type: MessageType;
  ai_summary?: string;
  suggested_reply?: string;
  is_read: boolean;
  received_at: string;
  created_at: string;
}

