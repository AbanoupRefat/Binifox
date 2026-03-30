-- Migration: Revamp services with image, clients, and sub_services
-- Run this in your Supabase SQL editor

-- 1. Add new columns to existing services table
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS clients text[] DEFAULT '{}';

-- 2. Create sub_services table
CREATE TABLE IF NOT EXISTS sub_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  gdrive_video_url text,
  created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS (match your existing services policy)
ALTER TABLE sub_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sub_services" ON sub_services
  FOR SELECT USING (true);

CREATE POLICY "Auth insert sub_services" ON sub_services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update sub_services" ON sub_services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete sub_services" ON sub_services
  FOR DELETE USING (auth.role() = 'authenticated');
