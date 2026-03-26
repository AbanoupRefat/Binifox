-- Supabase SQL Migration: Update Services Table with Details
-- This migration adds detailed fields to the services table to support service detail pages

-- Add new columns to the services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS short_description VARCHAR(150),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS process_steps TEXT[];

-- Create an index on title for faster searches
CREATE INDEX IF NOT EXISTS idx_services_title ON services(title);

-- Add comments to document the columns
COMMENT ON COLUMN services.short_description IS 'Brief description shown in service header (max 150 chars)';
COMMENT ON COLUMN services.description IS 'Full detailed description of the service, supports markdown';
COMMENT ON COLUMN services.image_url IS 'URL to the service image';
COMMENT ON COLUMN services.features IS 'Array of feature strings describing what the service offers';
COMMENT ON COLUMN services.process_steps IS 'Array of process step strings describing how the service is delivered';

-- Example data (optional - uncomment to use)
-- INSERT INTO services (title, icon_name, short_description, description, features, process_steps)
-- VALUES (
--   'Web Development',
--   'Code',
--   'Professional web development services',
--   'We create responsive, modern websites tailored to your business needs.',
--   ARRAY['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Secure'],
--   ARRAY['Consultation & Planning', 'Design & Development', 'Testing & QA', 'Launch & Support']
-- );

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON services
  FOR SELECT USING (true);

-- Create a policy to allow authenticated users to insert/update/delete
CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage services" ON services
  FOR ALL USING (auth.role() = 'authenticated');
