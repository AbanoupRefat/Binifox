-- Create all tables for the Binifox Supabase integration
-- Run this script in your Supabase SQL Editor

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Design', 'Logo', 'Business', 'Agency')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- 2. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  comments INTEGER DEFAULT 0,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- 4. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT NOT NULL,
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

-- 6. Stats Table
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL,
  value INTEGER NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stats_display_order ON stats(display_order);

-- 7. About Features Table
CREATE TABLE IF NOT EXISTS about_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_about_features_display_order ON about_features(display_order);

-- Enable Row Level Security on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_features ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY IF NOT EXISTS "Allow public read" ON projects FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read" ON articles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read" ON services FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read" ON team_members FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read" ON faqs FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read" ON stats FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read" ON about_features FOR SELECT USING (true);

-- Create policies for public insert access (needed for seeding)
-- Note: In production, you should restrict these to authenticated admin users only
CREATE POLICY IF NOT EXISTS "Allow public insert" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public insert" ON articles FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public insert" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public insert" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public insert" ON faqs FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public insert" ON stats FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public insert" ON about_features FOR INSERT WITH CHECK (true);
