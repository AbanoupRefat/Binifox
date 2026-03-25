# Database Seeding Instructions

This script seeds your Supabase database with the initial content data from the hardcoded components.

## Prerequisites

Before running the seed script, ensure you have:

1. **Created a Supabase project** at https://supabase.com
2. **Created the database tables** - Run the SQL script in `scripts/create-tables.sql`
3. **Updated your .env.local file** with valid Supabase credentials

## Step 1: Create Database Tables

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy the contents of `scripts/create-tables.sql` and paste it into the editor
5. Click "Run" to execute the SQL script
6. Verify the tables were created by checking the "Table Editor" section

## Getting Your Supabase Credentials (Step 2)

1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon) in the left sidebar
3. Click on "API" under Project Settings
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Update .env.local (Step 3)

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```

## Running the Seed Script (Step 4)

Once your credentials are configured, run:

```bash
# Set environment variables and run the seed script
$env:NEXT_PUBLIC_SUPABASE_URL="your_url"; $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="your_key"; bun run scripts/seed-database.ts
```

Or simply:

```bash
bun run seed
```

(Note: The `bun run seed` command may not load .env.local automatically, so you may need to set the environment variables manually as shown above)

## What Gets Seeded

The script will insert:
- 6 project records
- 3 article records  
- 8 service records
- 4 team member records
- 4 FAQ records
- 4 stat records
- 2 about feature records

## Troubleshooting

### "Invalid API key" error
- Double-check your Supabase credentials in .env.local
- Ensure you're using the anon/public key, not the service_role key
- Verify your Supabase project is active

### "relation does not exist" error
- The database tables haven't been created yet
- Run the SQL schema creation scripts first (see task 3)

### "new row violates row-level security policy" error
- RLS policies are blocking inserts
- Ensure you have policies that allow public inserts, or temporarily disable RLS for seeding
- After seeding, you can re-enable stricter RLS policies

## Next Steps

After successful seeding:
1. Verify the data in your Supabase dashboard (Table Editor)
2. Proceed to task 5: Create data fetching utility functions
