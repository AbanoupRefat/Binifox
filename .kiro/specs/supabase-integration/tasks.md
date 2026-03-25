# Implementation Plan

- [x] 1. Install dependencies and configure environment
  - Install @supabase/supabase-js package using bun
  - Create .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
  - Verify .env.local is in .gitignore
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - **Git**: Commit after setup with message "feat: configure Supabase environment and dependencies"

- [x] 2. Create Supabase client utility and type definitions
  - Create src/lib/supabase.ts with configured Supabase client
  - Create src/lib/database.types.ts with TypeScript interfaces for all tables
  - Create src/lib/iconMap.ts utility for mapping icon names to Lucide components
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - **Git**: Commit after creation with message "feat: add Supabase client and type definitions"

- [x] 3. Create database schema in Supabase
  - Database already created on Supabase website by user
  - Verify tables exist: projects, articles, services, team_members, faqs, stats, about_features
  - Verify Row Level Security is enabled with public read policies
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  - **Git**: Commit after verification with message "chore: verify database schema exists"

- [ ] 4. Seed database with existing hardcoded data
  - Insert all 6 project records from Portfolio component into projects table
  - Insert all 3 article records from News component into articles table
  - Insert all 8 service records from Services component into services table with display_order
  - Insert all 4 team member records from Team component into team_members table
  - Insert all 4 FAQ records from FAQ component into faqs table with display_order
  - Insert all 4 stat records from Stats component into stats table with display_order
  - Insert all 2 about feature records from About component into about_features table with display_order
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  - **Git**: Commit after seeding with message "feat: seed database with initial content data"

- [ ] 5. Create data fetching utility functions
  - Create src/lib/queries.ts with getProjects() function
  - Add getArticles() function to queries.ts
  - Add getServices() function to queries.ts
  - Add getTeamMembers() function to queries.ts
  - Add getFaqs() function to queries.ts
  - Add getStats() function to queries.ts
  - Add getAboutFeatures() function to queries.ts
  - _Requirements: 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1_
  - **Git**: Commit after creation with message "feat: add database query utility functions"

- [ ] 6. Migrate Services component to use Supabase
  - Convert Services component to async Server Component
  - Replace hardcoded services array with getServices() call
  - Map icon_name from database to Lucide icon components using iconMap
  - Add error handling with try-catch and ErrorFallback component
  - Test Services section displays correctly with database data
  - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - **Git**: Commit after migration with message "feat: migrate Services component to Supabase"

- [ ] 7. Migrate Stats component to use Supabase
  - Keep Stats as Client Component (needs counter animation)
  - Add useEffect to fetch stats data on mount using getStats()
  - Replace hardcoded stats array with state from database
  - Map icon_name from database to Lucide icon components
  - Add loading state while fetching data
  - Add error handling and error state display
  - Verify counter animation still works with database data
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - **Git**: Commit after migration with message "feat: migrate Stats component to Supabase"

- [ ] 8. Migrate About component to use Supabase
  - Convert About component to async Server Component
  - Replace hardcoded features array with getAboutFeatures() call
  - Map icon_name from database to Lucide icon components
  - Add error handling with try-catch and ErrorFallback component
  - Test About section displays correctly with database data
  - _Requirements: 11.1, 11.2, 11.3, 11.4_
  - **Git**: Commit after migration with message "feat: migrate About component to Supabase"

- [ ] 9. Migrate News component to use Supabase
  - Convert News component to async Server Component
  - Replace hardcoded articles array with getArticles() call
  - Add error handling with try-catch and ErrorFallback component
  - Test News section displays correctly with database data
  - _Requirements: 6.1, 6.2, 6.3_
  - **Git**: Commit after migration with message "feat: migrate News component to Supabase"

- [ ] 10. Migrate Team component to use Supabase
  - Convert Team component to async Server Component
  - Replace hardcoded teamMembers array with getTeamMembers() call
  - Update social links rendering to check for non-null URLs from database
  - Add conditional rendering for social icons based on URL presence
  - Add error handling with try-catch and ErrorFallback component
  - Test Team section displays correctly with database data
  - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - **Git**: Commit after migration with message "feat: migrate Team component to Supabase"

- [ ] 11. Migrate FAQ component to use Supabase
  - Keep FAQ as Client Component (needs accordion state)
  - Add useEffect to fetch FAQs data on mount using getFaqs()
  - Replace hardcoded faqs array with state from database
  - Add loading state while fetching data
  - Add error handling and error state display
  - Verify accordion interaction still works with database data
  - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - **Git**: Commit after migration with message "feat: migrate FAQ component to Supabase"

- [ ] 12. Migrate Portfolio component to use Supabase
  - Keep Portfolio as Client Component (needs filter state)
  - Add useEffect to fetch projects data on mount using getProjects()
  - Replace hardcoded projects array with state from database
  - Ensure category filtering logic works with database data
  - Add loading state while fetching data
  - Add error handling and error state display
  - Test filter functionality with database data
  - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - **Git**: Commit after migration with message "feat: migrate Portfolio component to Supabase"

- [ ] 13. Create reusable error and loading components
  - Create src/components/ErrorFallback.tsx component with retry button
  - Create src/components/LoadingSpinner.tsx component for loading states
  - Update all migrated components to use these shared components
  - _Requirements: 12.1, 12.2, 12.3, 12.4_
  - **Git**: Commit after creation with message "feat: add reusable error and loading components"

- [ ] 14. Test complete integration and verify functionality
  - Run bun install to ensure all dependencies are installed
  - Run bun run dev to start development server
  - Verify all sections load data from Supabase correctly
  - Test Portfolio filter functionality
  - Test FAQ accordion functionality
  - Test Stats counter animation
  - Verify no console errors or warnings
  - Test error handling by temporarily breaking database connection
  - Verify loading states display appropriately
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 12.1, 12.2, 12.3, 12.4_
  - **Git**: Commit after testing with message "test: verify complete Supabase integration"
