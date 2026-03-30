-- Create portfolio_clients table
CREATE TABLE IF NOT EXISTS public.portfolio_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    vision_mission TEXT,
    logo_url TEXT,
    category TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    snapchat_url TEXT,
    join_date DATE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_services table (links client to services)
CREATE TABLE IF NOT EXISTS public.portfolio_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.portfolio_clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT, -- Cover image for the service card
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_sub_services table (links service to sub-services/categories)
CREATE TABLE IF NOT EXISTS public.portfolio_sub_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_service_id UUID NOT NULL REFERENCES public.portfolio_services(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_media table (stores the actual gallery images)
CREATE TABLE IF NOT EXISTS public.portfolio_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_sub_service_id UUID NOT NULL REFERENCES public.portfolio_sub_services(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolio_services_client_id ON public.portfolio_services(client_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_sub_services_service_id ON public.portfolio_sub_services(portfolio_service_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_sub_service_id ON public.portfolio_media(portfolio_sub_service_id);

-- Enable Row Level Security
ALTER TABLE public.portfolio_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sub_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON public.portfolio_clients FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.portfolio_services FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.portfolio_sub_services FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.portfolio_media FOR SELECT USING (true);

-- Create policies for authenticated users full access
CREATE POLICY "Allow authenticated users full access" ON public.portfolio_clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access" ON public.portfolio_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access" ON public.portfolio_sub_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access" ON public.portfolio_media FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_portfolio_clients_updated_at BEFORE UPDATE ON public.portfolio_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_services_updated_at BEFORE UPDATE ON public.portfolio_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_sub_services_updated_at BEFORE UPDATE ON public.portfolio_sub_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_media_updated_at BEFORE UPDATE ON public.portfolio_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.portfolio_clients IS 'Stores company clients for the portfolio';
COMMENT ON TABLE public.portfolio_services IS 'Stores services performed for a specific client';
COMMENT ON TABLE public.portfolio_sub_services IS 'Stores sub-categories/sections within a client service (e.g., Facebook, Instagram)';
COMMENT ON TABLE public.portfolio_media IS 'Stores the gallery images for a portfolio sub-service';
