# Quick Start: Database Seeding

## You need to create the database tables first!

### Step 1: Create Tables in Supabase

1. Go to https://supabase.com and open your project
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy ALL the SQL from `scripts/create-tables.sql`
5. Paste it into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### Step 2: Run the Seed Script

Once the tables are created, run:

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL="https://sneqcufupyxnxlahvqoe.supabase.co"; $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_aPZFJEcgG_wl72HP06a4HQ_Hksnn9HI"; bun run scripts/seed-database.ts
```

Or simply:

```bash
bun run seed
```

(Note: You may need to set environment variables manually as shown in the first command)

### What This Will Do

The seed script will populate your database with:
- ✅ 6 projects
- ✅ 3 articles
- ✅ 8 services
- ✅ 4 team members
- ✅ 4 FAQs
- ✅ 4 stats
- ✅ 2 about features

---

**Current Status:** Your .env.local is already configured with the correct credentials!
