# Service Details Page Implementation Guide

## Overview

This guide explains the implementation of the dynamic service details page for the Binifox project. The service details page allows users to click on services from the main services list and view comprehensive information about each service.

## Changes Made

### 1. Database Schema Updates

**File**: `supabase_migrations_services.sql`

The services table has been extended with the following new columns:

| Column | Type | Description |
|--------|------|-------------|
| `short_description` | VARCHAR(150) | Brief description shown in service header |
| `description` | TEXT | Full detailed description (supports markdown) |
| `image_url` | VARCHAR(500) | URL to the service image |
| `features` | TEXT[] | Array of feature strings |
| `process_steps` | TEXT[] | Array of process step strings |

**To apply the migration to Supabase:**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase_migrations_services.sql`
5. Execute the query

### 2. Type Definitions

**File**: `src/lib/database.types.ts`

Updated the `services` table type to include the new fields:

```typescript
services: {
  Row: {
    id: string
    icon_name: string
    title: string
    description: string | null
    short_description: string | null
    image_url: string | null
    features: string[] | null
    process_steps: string[] | null
    created_at: string
  }
  // ... Insert and Update types
}
```

### 3. Components

#### Services Component (Updated)

**File**: `src/components/Services.tsx`

**Changes:**
- Wrapped each service card in a `Link` component pointing to `/services/{id}`
- Services are now clickable and navigate to the service details page
- Maintained all existing styling and hover effects

**Key Code:**
```typescript
<Link
  key={service.id}
  href={`/services/${service.id}`}
  className="group relative p-8 lg:p-10 border border-white/10 hover:bg-primary transition-all duration-300 cursor-pointer"
>
  {/* Service card content */}
</Link>
```

### 4. Service Details Page

**File**: `src/app/services/[id]/page.tsx`

**Features:**

1. **Dynamic Routing**: Uses Next.js dynamic routes with `[id]` parameter
2. **Static Generation**: Implements `generateStaticParams()` for all services
3. **Enhanced Header**: Displays service icon, title, and short description
4. **Overview Section**: Shows full service description
5. **Features & Benefits**: Lists service features with checkmark icons
6. **Process Steps**: Shows numbered process steps
7. **Why Choose Us**: Additional information section
8. **CTA Section**: Call-to-action button to contact page
9. **Navigation**: 
   - Back to Services link
   - Previous/Next service navigation buttons
10. **Related Services**: Shows all services at the bottom

**Layout Structure:**
```
Header
├── Service Icon & Title
├── Short Description
└── Background Image (if available)

Main Content
├── Overview Section
├── Features & Process Grid
├── Why Choose Us Section
├── CTA Section
├── Navigation (Back, Previous, Next)
└── All Services Section

Footer
```

### 5. Dashboard Service Management

**File**: `src/app/dashboard/services/page.tsx`

**New Features:**

1. **Collapsible Sections**: Organized form into expandable sections
   - Basic Information
   - Detailed Description
   - Features & Benefits
   - Process Steps

2. **Dynamic Field Management**:
   - Add/remove features dynamically
   - Add/remove process steps dynamically
   - Character counter for short description

3. **Rich Input Fields**:
   - Title input
   - Short description (150 char limit)
   - Full description (textarea with markdown support)
   - Image URL with preview
   - Icon selection with preview

4. **SQL Schema Reference**: Displays the database schema in the form
5. **Supabase Setup Instructions**: Step-by-step guide for database setup

**Form Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Service Title | Text | Yes | Main service name |
| Short Description | Text | No | 150 char max, shown in header |
| Full Description | Textarea | No | Supports markdown |
| Service Image | URL | No | Image preview included |
| Icon | Select | Yes | Choose from predefined icons |
| Features | Dynamic List | No | Add multiple features |
| Process Steps | Dynamic List | No | Add multiple steps |

## File Structure

```
Binifox/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── page.tsx (services list)
│   │   │   └── [id]/
│   │   │       └── page.tsx (service details - UPDATED)
│   │   └── dashboard/
│   │       └── services/
│   │           └── page.tsx (service management - UPDATED)
│   ├── components/
│   │   └── Services.tsx (UPDATED - now clickable)
│   └── lib/
│       └── database.types.ts (UPDATED - new fields)
└── supabase_migrations_services.sql (NEW)
```

## Usage Instructions

### For End Users

1. **Viewing Services**:
   - Go to the home page and scroll to "Explore Our Services"
   - Click on any service card to view detailed information
   - Use the previous/next buttons to navigate between services

2. **Contacting About a Service**:
   - On the service details page, click "Get a Free Estimate"
   - Fill out the contact form to inquire about the service

### For Administrators

1. **Adding a New Service**:
   - Go to Dashboard → Services
   - Fill in the service information:
     - Title (required)
     - Short description (optional, max 150 chars)
     - Full description (optional, supports markdown)
     - Service image URL (optional)
     - Icon (required)
     - Features (optional, add multiple)
     - Process steps (optional, add multiple)
   - Click "Save Service"

2. **Editing Service Details in Supabase**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Use SQL queries to update service details:
     ```sql
     UPDATE services 
     SET description = 'New description',
         features = ARRAY['Feature 1', 'Feature 2', 'Feature 3']
     WHERE id = 'service-id';
     ```

## Database Setup

### Running the Migration

**Option 1: Using Supabase Dashboard**

1. Open your Supabase project
2. Go to SQL Editor
3. Click "New Query"
4. Copy the contents of `supabase_migrations_services.sql`
5. Execute the query

**Option 2: Using Supabase CLI**

```bash
supabase migration new add_service_details
# Copy the migration content to the generated file
supabase db push
```

### Verifying the Schema

After running the migration, verify the schema:

```sql
-- Check the services table structure
\d services

-- Check if indexes were created
SELECT * FROM pg_indexes WHERE tablename = 'services';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'services';
```

## Data Format Examples

### Features Array

Features should be stored as a text array in Supabase:

```sql
ARRAY['Research beyond the business plan', 'Marketing options and rates', 'The ability to turnaround consulting', 'Customer engagement matters']
```

### Process Steps Array

Process steps should be stored as a numbered text array:

```sql
ARRAY['Consultation & Planning', 'Design & Development', 'Testing & QA', 'Launch & Support']
```

### Sample Service Data

```sql
INSERT INTO services (title, icon_name, short_description, description, image_url, features, process_steps)
VALUES (
  'Web Development',
  'Code',
  'Professional web development services',
  'We create responsive, modern websites tailored to your business needs. Our team specializes in building fast, secure, and scalable web applications.',
  'https://example.com/web-dev.jpg',
  ARRAY['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Secure & Scalable'],
  ARRAY['Consultation & Planning', 'Design & Development', 'Testing & QA', 'Launch & Support']
);
```

## Styling and Design

The service details page is designed to match the reference template at `https://html.storebuild.shop/binifox/services-details.html` with the following features:

- **Dark header** with service icon and title
- **White content section** with detailed information
- **Feature list** with checkmark icons
- **Process steps** with numbered circles
- **CTA section** with primary color background
- **Navigation buttons** for previous/next services
- **Responsive design** for mobile and desktop

## Customization

### Changing Colors

Edit the Tailwind CSS classes in the component files:
- Primary color: `bg-primary`, `text-primary`
- Dark color: `text-dark`, `bg-dark`

### Adding More Icons

1. Import additional icons from `lucide-react`
2. Add them to the `iconOptions` array in `src/app/dashboard/services/page.tsx`
3. Update the `iconMap.ts` file to include the new icons

### Modifying the Layout

The service details page layout can be customized by editing the sections in `src/app/services/[id]/page.tsx`:

- Adjust grid layouts in the features/process section
- Modify spacing with Tailwind padding/margin classes
- Change colors and typography as needed

## Troubleshooting

### Services not appearing on details page

**Issue**: Service details page shows "Service not found"

**Solution**:
1. Verify the service ID is valid
2. Check that the service exists in Supabase
3. Ensure the migration has been applied

### Images not loading

**Issue**: Service image URL shows error

**Solution**:
1. Verify the image URL is correct and publicly accessible
2. Check CORS settings if image is from external domain
3. Use a different image hosting service if needed

### Features/Process steps not displaying

**Issue**: Features or process steps are empty on the details page

**Solution**:
1. Ensure the data is stored as a text array in Supabase
2. Check the data format in the database
3. Verify the parsing logic in the component

## Performance Considerations

- **Static Generation**: All service pages are pre-generated at build time for optimal performance
- **Image Optimization**: Consider using Next.js Image component for better image loading
- **Caching**: Service data is cached and revalidated on updates
- **Database Indexes**: Indexes are created on the title column for faster searches

## Security

- **Row Level Security (RLS)**: Enabled on the services table
- **Public Read Access**: Services are readable by anyone
- **Authenticated Write Access**: Only authenticated users can create/update services
- **Input Validation**: All inputs are validated before submission

## Next Steps

1. Apply the database migration to your Supabase project
2. Test the service details page by adding a new service from the dashboard
3. Customize the styling to match your brand
4. Add more services with detailed information
5. Monitor performance and optimize as needed

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check the Next.js documentation for dynamic routing
4. Review the component code for customization options
