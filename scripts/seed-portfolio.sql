-- ============================================================
-- Portfolio Placeholder Seed Data
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create portfolio tables if they don't exist yet
-- ============================================================

CREATE TABLE IF NOT EXISTS portfolio_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  vision_mission text,
  logo_url text,
  category text,
  facebook_url text,
  instagram_url text,
  snapchat_url text,
  join_date text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_client_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES portfolio_clients(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_proof_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES portfolio_clients(id) ON DELETE CASCADE,
  sub_service_id uuid NOT NULL REFERENCES sub_services(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolio_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_proof_media ENABLE ROW LEVEL SECURITY;

-- Public read policies
DO $$ BEGIN
  CREATE POLICY "Public read portfolio_clients" ON portfolio_clients FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public read portfolio_client_services" ON portfolio_client_services FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public read portfolio_proof_media" ON portfolio_proof_media FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 2. Insert placeholder clients
-- ============================================================

INSERT INTO portfolio_clients (id, name, description, vision_mission, category, facebook_url, instagram_url, join_date, display_order)
VALUES
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    'Nova Tech Solutions',
    'A leading technology firm specializing in enterprise software and digital transformation strategies across the MENA region.',
    'To empower businesses through innovative technology and deliver solutions that drive measurable growth and lasting impact.',
    'Technology',
    'https://facebook.com',
    'https://instagram.com',
    'March 2023',
    1
  ),
  (
    'aaaaaaaa-0002-0002-0002-000000000002',
    'Luxe Fashion House',
    'A premium fashion brand offering exclusive collections and bespoke styling services for the modern, discerning consumer.',
    'To redefine luxury fashion in the Arab world by blending heritage craftsmanship with contemporary design excellence.',
    'Fashion & Retail',
    'https://facebook.com',
    'https://instagram.com',
    'June 2023',
    2
  ),
  (
    'aaaaaaaa-0003-0003-0003-000000000003',
    'HealthFirst Clinics',
    'A network of modern healthcare clinics providing comprehensive medical services, diagnostics, and wellness programmes.',
    'To make world-class healthcare accessible to every individual and community through compassionate, technology-driven care.',
    'Healthcare',
    'https://facebook.com',
    null,
    'January 2024',
    3
  )
ON CONFLICT (id) DO NOTHING;


-- 3. Link clients to your existing services (picks the first 2 services automatically)
-- ============================================================

WITH first_services AS (
  SELECT id, row_number() OVER (ORDER BY created_at ASC) AS rn
  FROM services
  LIMIT 3
)
INSERT INTO portfolio_client_services (client_id, service_id, display_order)
SELECT
  client_id,
  service_id,
  display_order
FROM (
  -- Nova Tech → service 1 & 2
  SELECT 'aaaaaaaa-0001-0001-0001-000000000001'::uuid AS client_id, id AS service_id, rn AS display_order
  FROM first_services WHERE rn <= 2

  UNION ALL

  -- Luxe Fashion → service 1 & 3
  SELECT 'aaaaaaaa-0002-0002-0002-000000000002'::uuid, id, rn
  FROM first_services WHERE rn IN (1, 3)

  UNION ALL

  -- HealthFirst → service 2 & 3
  SELECT 'aaaaaaaa-0003-0003-0003-000000000003'::uuid, id, rn
  FROM first_services WHERE rn IN (2, 3)
) t
ON CONFLICT DO NOTHING;


-- 4. Add proof media samples (links to first sub_service of each service)
-- ============================================================

WITH first_subs AS (
  SELECT id AS sub_id, row_number() OVER (ORDER BY created_at ASC) AS rn
  FROM sub_services
  LIMIT 2
)
INSERT INTO portfolio_proof_media (client_id, sub_service_id, url, caption, display_order)
SELECT
  'aaaaaaaa-0001-0001-0001-000000000001'::uuid,
  sub_id,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  'Campaign results – Q1 2024',
  rn
FROM first_subs
ON CONFLICT DO NOTHING;


-- ============================================================
-- Done! You should now see 3 clients in your portfolio.
-- Visit /portfolio on your site to verify.
-- ============================================================
