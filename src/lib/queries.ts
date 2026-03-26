import { supabase } from './supabase'
import type { Database } from './database.types'

// Type aliases for cleaner code
type Project = Database['public']['Tables']['projects']['Row']
type News = Database['public']['Tables']['news']['Row']
type Service = Database['public']['Tables']['services']['Row']
type TeamMember = Database['public']['Tables']['team_members']['Row']
type Faq = Database['public']['Tables']['faqs']['Row']
type Stat = Database['public']['Tables']['stats']['Row']
type AboutFeature = Database['public']['Tables']['about_features']['Row']
type Pricing = Database['public']['Tables']['pricing']['Row']

// Compatibility types for components
type Article = {
  id: string
  image: string
  date: string
  author: string
  comments: number
  title: string
  created_at: string
}

type ProjectCompat = Omit<Project, 'image_url'> & { image: string }
type TeamMemberCompat = Omit<TeamMember, 'image_url'> & { image: string }

/**
 * Fetch all projects ordered by creation date (newest first)
 */
export async function getProjects(): Promise<ProjectCompat[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  // Map image_url to image for compatibility
  return (data || []).map((p: Project) => ({ ...p, image: p.image_url }))
}

/**
 * Fetch all articles ordered by date (newest first)
 */
export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  // Map fields to match expected structure
  return (data || []).map((n: News) => ({ 
    ...n, 
    image: n.image_url,
    comments: n.comments_count,
    date: new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }))
}

/**
 * Fetch all services ordered by display order
 */
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Fetch all team members
 */
export async function getTeamMembers(): Promise<TeamMemberCompat[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
  
  if (error) throw error
  // Map image_url to image for compatibility
  return (data || []).map((t: TeamMember) => ({ ...t, image: t.image_url }))
}

/**
 * Fetch all FAQs ordered by display order
 */
export async function getFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Fetch all stats ordered by display order
 */
export async function getStats(): Promise<Stat[]> {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Fetch all about features ordered by display order
 */
export async function getAboutFeatures(): Promise<AboutFeature[]> {
  // Fallback data since about_features table doesn't exist in current schema
  return [
    {
      id: '1',
      icon_name: 'Target',
      title: 'Our Mission',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      display_order: 1,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      icon_name: 'Award',
      title: 'Best Services',
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.',
      display_order: 2,
      created_at: new Date().toISOString()
    }
  ]
}

/**
 * Fetch all pricing plans ordered by display order
 */
export async function getPricing(): Promise<Pricing[]> {
  const { data, error } = await supabase
    .from('pricing')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Fetch a single project by ID
 */
export async function getProjectById(id: string): Promise<ProjectCompat | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching project:', error)
    return null
  }
  
  if (!data) return null
  return { ...data, image: data.image_url }
}

/**
 * Fetch a single article by ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching article:', error)
    return null
  }
  
  if (!data) return null
  return {
    ...data,
    image: data.image_url,
    comments: data.comments_count,
    date: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

/**
 * Fetch a single team member by ID
 */
export async function getTeamMemberById(id: string): Promise<TeamMemberCompat | null> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching team member:', error)
    return null
  }
  
  if (!data) return null
  return { ...data, image: data.image_url }
}

/**
 * Fetch a single service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching service:', error)
    return null
  }
  
  return data || null
}
