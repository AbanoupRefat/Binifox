# Design Document

## Overview

This design document outlines the architecture and implementation strategy for integrating Supabase as the backend database for the Binifox digital agency website. The integration will transform the application from using hardcoded data arrays to a dynamic, database-driven system while maintaining the existing UI/UX and component structure.

### Key Design Principles

1. **Minimal Component Refactoring**: Preserve existing component logic and UI while replacing data sources
2. **Type Safety**: Leverage TypeScript for database schema types and query results
3. **Performance**: Use Next.js Server Components where possible for optimal data fetching
4. **Error Resilience**: Implement graceful fallbacks for database failures
5. **Developer Experience**: Create reusable utilities and clear patterns for database access

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
│                                                               │
│  ┌────────────────┐         ┌──────────────────┐            │
│  │ Server         │         │ Client           │            │
│  │ Components     │         │ Components       │            │
│  │                │         │                  │            │
│  │ - Fetch data   │         │ - Interactive    │            │
│  │ - No hydration │         │ - Client state   │            │
│  └────────┬───────┘         └────────┬─────────┘            │
│           │                          │                       │
│           └──────────┬───────────────┘                       │
│                      │                                       │
│              ┌───────▼────────┐                              │
│              │ Supabase       │                              │
│              │ Client Utility │                              │
│              └───────┬────────┘                              │
└──────────────────────┼──────────────────────────────────────┘
                       │
                       │ HTTPS
                       │
              ┌────────▼─────────┐
              │                  │
              │  Supabase Cloud  │
              │                  │
              │  ┌────────────┐  │
              │  │ PostgreSQL │  │
              │  │  Database  │  │
              │  └────────────┘  │
              │                  │
              └──────────────────┘
```

### Component Architecture Decision

**Hybrid Approach**: Use Server Components for initial data fetching, convert to Client Components only when interactivity requires it.

- **Portfolio**: Client Component (needs filter state)
- **News**: Server Component (static display)
- **Services**: Server Component (static display)
- **Team**: Server Component (static display)
- **FAQ**: Client Component (needs accordion state)
- **Stats**: Client Component (needs counter animation)
- **About**: Server Component (static display)

## Components and Interfaces

### 1. Environment Configuration

**File**: `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://sneqcufupyxnxlahvqoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_aPZFJEcgG_wl72HP06a4HQ_Hksnn9HI
```

**Security Considerations**:
- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Never commit `.env.local` to version control
- Anon key is safe for client-side use (RLS policies protect data)

### 2. Supabase Client Utility

**File**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

**Design Rationale**:
- Single client instance for consistency
- Type-safe with generated Database types
- Simple import pattern: `import { supabase } from '@/lib/supabase'`

### 3. Database Type Definitions

**File**: `src/lib/database.types.ts`

TypeScript interfaces matching the database schema:

```typescript
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          image: string
          title: string
          category: string
          created_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at'>
        Update: Partial<Insert>
      }
      articles: {
        Row: {
          id: string
          image: string
          date: string
          author: string
          comments: number
          title: string
          created_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at'>
        Update: Partial<Insert>
      }
      // ... other tables
    }
  }
}
```

**Design Rationale**:
- Provides autocomplete and type checking
- Separates Row (select), Insert, and Update types
- Can be auto-generated using Supabase CLI

### 4. Data Fetching Utilities

**File**: `src/lib/queries.ts`

Centralized query functions for reusability:

```typescript
import { supabase } from './supabase'

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })
  
  if (error) throw error
  return data
}

// ... other query functions
```

**Design Rationale**:
- Encapsulates database logic
- Easy to test and mock
- Consistent error handling pattern

### 5. Icon Mapping Utility

**File**: `src/lib/iconMap.ts`

Maps string icon names to Lucide React components:

```typescript
import { 
  Monitor, Code, Palette, Globe, Smartphone, 
  PenTool, Layout, BarChart3, Users, Smile, 
  Award, Settings, Star, Shield 
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const iconMap: Record<string, LucideIcon> = {
  Monitor, Code, Palette, Globe, Smartphone,
  PenTool, Layout, BarChart3, Users, Smile,
  Award, Settings, Star, Shield
}

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Monitor // fallback
}
```

**Design Rationale**:
- Allows storing icon names as strings in database
- Type-safe icon component retrieval
- Provides sensible fallback

## Data Models

### Database Schema

#### 1. Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Design', 'Logo', 'Business', 'Agency')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**: 
- Primary key on `id`
- Index on `category` for filtering

#### 2. Articles Table

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  comments INTEGER DEFAULT 0,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- Primary key on `id`
- Index on `created_at` for ordering

#### 3. Services Table

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- Primary key on `id`
- Index on `display_order` for ordering

#### 4. Team Members Table

```sql
CREATE TABLE team_members (
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
```

#### 5. FAQs Table

```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- Primary key on `id`
- Index on `display_order` for ordering

#### 6. Stats Table

```sql
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL,
  value INTEGER NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- Primary key on `id`
- Index on `display_order` for ordering

#### 7. About Features Table

```sql
CREATE TABLE about_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- Primary key on `id`
- Index on `display_order` for ordering

### Row Level Security (RLS)

For Phase 1, we'll enable RLS but allow public read access:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);

-- Repeat for all tables
```

**Future Enhancement**: Add authentication and admin-only write policies

## Error Handling

### Error Handling Strategy

1. **Try-Catch in Server Components**:
```typescript
export default async function News() {
  try {
    const articles = await getArticles()
    return <ArticlesGrid articles={articles} />
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return <ErrorFallback message="Unable to load articles" />
  }
}
```

2. **Null Checks in Client Components**:
```typescript
export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(err => {
        console.error(err)
        setError('Failed to load projects')
      })
  }, [])
  
  if (error) return <ErrorMessage message={error} />
  // ... rest of component
}
```

3. **Loading States**:
```typescript
const [loading, setLoading] = useState(true)

if (loading) return <LoadingSpinner />
```

### Error UI Components

**File**: `src/components/ErrorFallback.tsx`

```typescript
export function ErrorFallback({ message }: { message: string }) {
  return (
    <div className="py-20 text-center">
      <p className="text-muted-foreground">{message}</p>
      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  )
}
```

## Testing Strategy

### 1. Database Connection Testing

- Verify environment variables are loaded
- Test Supabase client initialization
- Confirm database connectivity

### 2. Query Testing

- Test each query function returns expected data structure
- Verify error handling for network failures
- Check ordering and filtering logic

### 3. Component Testing

- Verify components render with database data
- Test loading states display correctly
- Confirm error states show appropriate messages
- Validate interactive features (filters, accordions) still work

### 4. Integration Testing

- Test full page load with all components
- Verify no hydration mismatches
- Check performance metrics (Time to First Byte, Largest Contentful Paint)

### 5. Manual Testing Checklist

- [ ] All components display data correctly
- [ ] Portfolio filter works with database data
- [ ] FAQ accordion maintains state
- [ ] Stats counter animation works
- [ ] Images load properly
- [ ] No console errors
- [ ] Graceful error handling when database is unreachable

## Migration Strategy

### Phase 1: Setup (Non-Breaking)

1. Install dependencies
2. Create environment variables
3. Create Supabase client utility
4. Create database tables
5. Seed initial data

**Risk**: Low - No code changes yet

### Phase 2: Component Migration (Incremental)

Migrate one component at a time in this order:

1. **Services** (simplest, no interactivity)
2. **Stats** (client component, test icon mapping)
3. **About** (test icon mapping)
4. **News** (server component)
5. **Team** (test social links logic)
6. **FAQ** (client component with state)
7. **Portfolio** (client component with filtering)

**Risk**: Medium - Test each component before moving to next

### Phase 3: Cleanup

1. Remove hardcoded data arrays
2. Add loading states
3. Improve error messages
4. Performance optimization

**Risk**: Low - Refinement only

## Performance Considerations

### 1. Server Components for Static Data

Use Server Components for Services, News, Team, About to:
- Reduce JavaScript bundle size
- Improve initial page load
- Enable server-side caching

### 2. Client Components for Interactivity

Keep Portfolio, FAQ, Stats as Client Components because:
- Portfolio needs filter state
- FAQ needs accordion state
- Stats needs animation state

### 3. Data Fetching Optimization

- Use `select('*')` initially, optimize to specific columns later
- Add database indexes on frequently queried columns
- Consider implementing pagination for large datasets (future)

### 4. Caching Strategy

Next.js App Router automatically caches Server Component data fetches:
```typescript
// Revalidate every hour
export const revalidate = 3600

export default async function News() {
  const articles = await getArticles()
  // ...
}
```

## Security Considerations

### 1. Environment Variables

- Never commit `.env.local` to Git
- Use `NEXT_PUBLIC_` prefix only for client-safe values
- Anon key is safe for client use (protected by RLS)

### 2. Row Level Security

- Enable RLS on all tables
- Start with public read access
- Plan for admin authentication in Phase 2

### 3. Input Validation

- Database constraints prevent invalid data
- TypeScript types provide compile-time safety
- Supabase validates queries server-side

### 4. SQL Injection Prevention

- Supabase client uses parameterized queries
- No raw SQL in application code
- All queries go through Supabase API

## Deployment Considerations

### Environment Variables in Production

Netlify/Vercel deployment:
1. Add environment variables in hosting platform dashboard
2. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Redeploy application

### Database Migrations

For future schema changes:
1. Use Supabase Dashboard SQL Editor
2. Or use Supabase CLI migrations
3. Test in staging environment first

### Monitoring

- Monitor Supabase dashboard for query performance
- Set up error tracking (Sentry, LogRocket)
- Track Core Web Vitals in production

## Future Enhancements

### Phase 2: Content Management

- Add authentication for admin users
- Create admin dashboard for content editing
- Implement CRUD operations for all entities

### Phase 3: Advanced Features

- Image upload to Supabase Storage
- Full-text search across content
- Analytics and view tracking
- Content versioning and drafts

### Phase 4: Optimization

- Implement pagination for large datasets
- Add client-side caching with React Query
- Optimize images with Supabase Image Transformation
- Add real-time subscriptions for live updates
