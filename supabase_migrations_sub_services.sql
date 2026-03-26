-- Supabase SQL Migration: Add Sub-Services Support
-- This migration adds clients array to services table and creates a new sub_services table

-- Step 1: Add clients array to services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS clients TEXT[];

-- Add comment to document the column
COMMENT ON COLUMN services.clients IS 'Array of client names associated with this service';

-- Step 2: Create sub_services table
CREATE TABLE IF NOT EXISTS sub_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  gdrive_video_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on service_id for faster queries
CREATE INDEX IF NOT EXISTS idx_sub_services_service_id ON sub_services(service_id);
CREATE INDEX IF NOT EXISTS idx_sub_services_display_order ON sub_services(display_order);

-- Add comments to document the columns
COMMENT ON TABLE sub_services IS 'Sub-services associated with main services, each with their own image and video';
COMMENT ON COLUMN sub_services.service_id IS 'Foreign key reference to the parent service';
COMMENT ON COLUMN sub_services.title IS 'Title of the sub-service';
COMMENT ON COLUMN sub_services.description IS 'Detailed description of the sub-service';
COMMENT ON COLUMN sub_services.image_url IS 'URL to the sub-service image';
COMMENT ON COLUMN sub_services.gdrive_video_url IS 'Google Drive video URL for embedding';
COMMENT ON COLUMN sub_services.display_order IS 'Order in which to display sub-services';

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE sub_services ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON sub_services
  FOR SELECT USING (true);

-- Create a policy to allow authenticated users to manage sub-services
CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage sub-services" ON sub_services
  FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sub_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sub_services_updated_at_trigger
BEFORE UPDATE ON sub_services
FOR EACH ROW
EXECUTE FUNCTION update_sub_services_updated_at();
