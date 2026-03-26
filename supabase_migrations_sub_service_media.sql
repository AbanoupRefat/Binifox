-- Create sub_service_media table
CREATE TABLE IF NOT EXISTS public.sub_service_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_service_id UUID NOT NULL REFERENCES public.sub_services(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_sub_service_media_sub_service_id ON public.sub_service_media(sub_service_id);
CREATE INDEX IF NOT EXISTS idx_sub_service_media_display_order ON public.sub_service_media(display_order);

-- Enable Row Level Security
ALTER TABLE public.sub_service_media ENABLE CONTROL;
ALTER TABLE public.sub_service_media ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access
CREATE POLICY "Allow public read access" ON public.sub_service_media
    FOR SELECT USING (true);

-- Allow authenticated users full access (for dashboard)
CREATE POLICY "Allow authenticated users full access" ON public.sub_service_media
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sub_service_media_updated_at
    BEFORE UPDATE ON public.sub_service_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.sub_service_media IS 'Stores multiple images and videos for each sub-service';
COMMENT ON COLUMN public.sub_service_media.type IS 'Type of media: image or video';
