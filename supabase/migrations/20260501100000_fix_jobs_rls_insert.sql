-- Fix: Add INSERT policy for jobs table
-- The jobs table is a global catalog populated by the server-side sync API.
-- Authenticated users (via server API routes) need to be able to insert jobs.

CREATE POLICY "Authenticated users can insert jobs"
ON jobs FOR INSERT
TO authenticated
WITH CHECK (true);
