-- Create portfolio_clients table to store client details
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

-- Create a junction table to link portfolio_clients with existing services
-- This allows a client to have multiple services in their portfolio
CREATE TABLE IF NOT EXISTS public.portfolio_client_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.portfolio_clients(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id, service_id)
);

-- Create portfolio_media table to store the actual gallery images/proof of concept
-- It links directly to the sub_services to avoid repeating sub-service entry
-- This table is specific to the "Portfolio" view of a sub-service for a specific client
CREATE TABLE IF NOT EXISTS public.portfolio_proof_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.portfolio_clients(id) ON DELETE CASCADE,
    sub_service_id UUID NOT NULL REFERENCES public.sub_services(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolio_client_services_client_id ON public.portfolio_client_services(client_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_proof_media_client_sub ON public.portfolio_proof_media(client_id, sub_service_id);

-- Enable Row Level Security
ALTER TABLE public.portfolio_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_proof_media ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON public.portfolio_clients FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.portfolio_client_services FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.portfolio_proof_media FOR SELECT USING (true);

-- Create policies for authenticated users full access
CREATE POLICY "Allow authenticated users full access" ON public.portfolio_clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access" ON public.portfolio_client_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access" ON public.portfolio_proof_media FOR ALL USING (auth.role() = 'authenticated');

-- Add triggers for updated_at
CREATE TRIGGER update_portfolio_clients_updated_at BEFORE UPDATE ON public.portfolio_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_proof_media_updated_at BEFORE UPDATE ON public.portfolio_proof_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.portfolio_clients IS 'Stores company clients for the portfolio';
COMMENT ON TABLE public.portfolio_client_services IS 'Links portfolio clients to existing dashboard services';
COMMENT ON TABLE public.portfolio_proof_media IS 'Stores gallery images (proof of concept) for a client sub-service';
