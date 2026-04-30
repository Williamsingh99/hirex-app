-- Phase 1: Database Architecture for HireX
-- This migration sets up the core tables for portals, jobs, applications, and messages.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean schema
DROP TABLE IF EXISTS messages, applications, jobs, portals CASCADE;

-- 1. Portals Table
-- Stores the connected portals for each user
CREATE TABLE portals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    portal_name TEXT NOT NULL, -- 'naukri', 'indeed', 'linkedin', etc.
    api_key TEXT,
    access_token TEXT,
    refresh_token TEXT,
    status TEXT DEFAULT 'connected',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Jobs Table
-- Global catalog of jobs found across portals.
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portal_name TEXT NOT NULL,
    portal_job_id TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    is_remote BOOLEAN DEFAULT false,
    salary_min NUMERIC,
    salary_max NUMERIC,
    currency TEXT DEFAULT 'USD',
    description TEXT,
    required_skills TEXT[],
    experience_required TEXT,
    employment_type TEXT,
    posted_at TIMESTAMPTZ,
    apply_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portal_name, portal_job_id)
);

-- 3. Applications Table
-- Tracks a specific user's application to a specific job
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    portal_name TEXT NOT NULL,
    resume_id UUID,
    cover_letter TEXT,
    applied_via TEXT NOT NULL, -- 'auto' or 'manual'
    status TEXT NOT NULL DEFAULT 'Applied', -- 'Queued', 'Applied', 'Interviewing', 'Rejected'
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Messages Table
-- Communication related to a specific application
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    portal_name TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_company TEXT,
    subject TEXT,
    body TEXT NOT NULL,
    message_type TEXT NOT NULL, -- 'interview_invite', 'rejection', etc.
    ai_summary TEXT,
    suggested_reply TEXT,
    is_read BOOLEAN DEFAULT false,
    received_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Portals: Users can only see/edit their own portal connections
CREATE POLICY "Users can manage their own portals"
ON portals FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Jobs: Jobs are global (read-only for all authenticated users)
CREATE POLICY "Jobs are viewable by authenticated users"
ON jobs FOR SELECT
TO authenticated
USING (true);

-- Applications: Users can only see/edit their own applications
CREATE POLICY "Users can manage their own applications"
ON applications FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Messages: Users can only see/edit their own messages
CREATE POLICY "Users can manage their own messages"
ON messages FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
