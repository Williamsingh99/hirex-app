-- USERS PROFILE (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text unique not null,
  avatar_url text,
  phone text,
  location text,
  headline text,                    -- "Senior Frontend Dev | React | 5yr"
  linkedin_url text,
  github_url text,
  portfolio_url text,
  years_experience integer default 0,
  target_role text,                 -- What job they're looking for
  target_salary_min integer,
  target_salary_max integer,
  preferred_locations text[],       -- ['Pune', 'Remote', 'Bangalore']
  open_to_remote boolean default true,
  plan text default 'free',         -- 'free' | 'pro' | 'enterprise'
  auto_apply_enabled boolean default false,
  daily_apply_limit integer default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RESUMES
create table public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,           -- Supabase Storage URL
  file_size integer,
  raw_text text,                    -- Extracted PDF text
  parsed_data jsonb,                -- Structured: {skills[], experience[], education[]}
  ats_score integer,                -- 0-100
  ats_issues jsonb,                 -- Array of improvement suggestions
  optimized_text text,              -- AI-rewritten version
  is_active boolean default true,   -- Which resume to use for applying
  version integer default 1,
  created_at timestamptz default now()
);

-- JOB PORTALS (connected accounts)
create table public.portal_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  portal text not null,             -- 'naukri' | 'indeed' | 'linkedin'
  status text default 'active',     -- 'active' | 'expired' | 'error'
  access_token text,                -- Encrypted OAuth token
  refresh_token text,
  portal_user_id text,              -- User's ID on that portal
  portal_email text,
  portal_profile_url text,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, portal)
);

-- JOB LISTINGS (fetched and ranked)
create table public.job_listings (
  id uuid default gen_random_uuid() primary key,
  portal text not null,             -- Source portal
  portal_job_id text,               -- Original ID on that portal
  title text not null,
  company text not null,
  location text,
  is_remote boolean default false,
  salary_min integer,
  salary_max integer,
  currency text default 'INR',
  description text,                 -- Full JD text
  required_skills text[],
  experience_required text,
  employment_type text,             -- 'Full-time' | 'Contract' etc
  posted_at timestamptz,
  deadline_at timestamptz,
  apply_url text,
  created_at timestamptz default now(),
  unique(portal, portal_job_id)
);

-- JOB MATCHES (AI-ranked jobs per user)
create table public.job_matches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.job_listings(id) on delete cascade,
  match_score numeric(5,2),         -- 0-100 AI semantic score
  skill_match_pct numeric(5,2),
  experience_match boolean,
  salary_match boolean,
  location_match boolean,
  missing_skills text[],            -- Skills gap
  match_reason text,                -- AI explanation: "Strong React match"
  status text default 'pending',    -- 'pending'|'queued'|'applied'|'skipped'
  created_at timestamptz default now()
);

-- APPLICATIONS (applied jobs)
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.job_listings(id),
  portal text not null,
  resume_id uuid references public.resumes(id),
  cover_letter text,               -- AI-generated per JD
  applied_via text default 'auto', -- 'auto' | 'manual'
  status text default 'applied',   -- 'applied'|'viewed'|'shortlisted'|'interview'|'rejected'|'offer'
  applied_at timestamptz default now(),
  last_status_update timestamptz default now(),
  notes text
);

-- RECRUITER MESSAGES
create table public.recruiter_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  application_id uuid references public.applications(id),
  portal text,                     -- 'gmail' | 'linkedin' | 'naukri'
  message_id text,                 -- Gmail message ID
  sender_name text,
  sender_email text,
  sender_company text,
  subject text,
  body text,
  message_type text,               -- 'interview_invite'|'rejection'|'offer'|'general'
  ai_summary text,                 -- 1-line AI summary
  suggested_reply text,            -- AI-drafted reply
  is_read boolean default false,
  received_at timestamptz default now()
);

-- ROW LEVEL SECURITY (enable on all tables)
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.portal_connections enable row level security;
alter table public.job_matches enable row level security;
alter table public.applications enable row level security;
alter table public.recruiter_messages enable row level security;

-- RLS POLICIES (users see only their own data)
create policy "Users own their profile"
  on public.profiles for all using (auth.uid() = id);
create policy "Users own their resumes"
  on public.resumes for all using (auth.uid() = user_id);
create policy "Users own their portal connections"
  on public.portal_connections for all using (auth.uid() = user_id);
create policy "Users own their job matches"
  on public.job_matches for all using (auth.uid() = user_id);
create policy "Users own their applications"
  on public.applications for all using (auth.uid() = user_id);
create policy "Users own their messages"
  on public.recruiter_messages for all using (auth.uid() = user_id);

-- Job listings are public read
alter table public.job_listings enable row level security;
create policy "Job listings are public"
  on public.job_listings for select using (true);
