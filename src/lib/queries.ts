// @ts-nocheck
import { supabase } from './supabase'
import type { Database } from './database.types'

/**
 * Validates if a string is a valid UUID
 */
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
  if (!isValidUUID(id)) return null;
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching project:', error.message);
      return null;
    }
    
    return data ? { ...data, image: data.image_url } : null;
  } catch (err) {
    console.error('Unexpected error fetching project:', err);
    return null;
  }
}

/**
 * Fetch a single article by ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
  if (!isValidUUID(id)) return null;

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching article:', error.message);
      return null;
    }
    
    if (!data) return null;
    return {
      ...data,
      image: data.image_url,
      comments: data.comments_count,
      date: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  } catch (err) {
    console.error('Unexpected error fetching article:', err);
    return null;
  }
}

/**
 * Fetch a single team member by ID
 */
export async function getTeamMemberById(id: string): Promise<TeamMemberCompat | null> {
  if (!isValidUUID(id)) return null;

  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching team member:', error.message);
      return null;
    }
    
    return data ? { ...data, image: data.image_url } : null;
  } catch (err) {
    console.error('Unexpected error fetching team member:', err);
    return null;
  }
}

/**
 * Fetch a single service by ID with nested sub_services
 */
export type ServiceWithSubs = Database['public']['Tables']['services']['Row'] & {
  sub_services: Database['public']['Tables']['sub_services']['Row'][]
}

export async function getServiceWithSubServices(id: string): Promise<ServiceWithSubs | null> {
  if (!isValidUUID(id)) return null;
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*, sub_services(*)')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null;
      return null;
    }
    return data as unknown as ServiceWithSubs;
  } catch {
    return null;
  }
}

/**
 * Fetch a single service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  if (!isValidUUID(id)) return null;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching service:', error.message);
      return null;
    }
    
    return data || null;
  } catch (err) {
    console.error('Unexpected error fetching service:', err);
    return null;
  }
}

type SubService = Database['public']['Tables']['sub_services']['Row']
type SubServiceMedia = Database['public']['Tables']['sub_service_media']['Row']

// Extended sub-service type with nested media
export type SubServiceWithMedia = SubService & {
  sub_service_media: SubServiceMedia[]
}

// Extended service type with nested sub_services
export type ServiceWithSubServices = Service & {
  sub_services: SubService[]
}

// Portfolio Types
export type PortfolioClient = Database['public']['Tables']['portfolio_clients']['Row']
type PortfolioClientService = Database['public']['Tables']['portfolio_client_services']['Row']
export type PortfolioProofMedia = Database['public']['Tables']['portfolio_proof_media']['Row']

export type PortfolioClientWithServices = PortfolioClient & {
  services: ServiceWithSubServices[],
  active_sub_service_ids: string[]
}

/**
 * Fetch a single service by ID with nested sub-services
 */
export async function getServiceByIdWithSubServices(id: string): Promise<ServiceWithSubServices | null> {
  if (!isValidUUID(id)) return null;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*, sub_services(*)')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching service with sub-services:', error.message);
      return null;
    }
    
    if (!data) return null;
    
    return {
      ...data,
      sub_services: (data.sub_services as SubService[]) || []
    } as ServiceWithSubServices;
  } catch (err) {
    console.error('Unexpected error fetching service with sub-services:', err);
    return null;
  }
}

/**
 * Fetch a single sub-service by ID with nested media
 */
export async function getSubServiceByIdWithMedia(id: string): Promise<SubServiceWithMedia | null> {
  if (!isValidUUID(id)) return null;

  try {
    const { data, error } = await supabase
      .from('sub_services')
      .select('*, sub_service_media(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching sub-service with media:', error.message);
      return null;
    }
    
    if (!data) return null;
    
    return {
      ...data,
      sub_service_media: (data.sub_service_media as SubServiceMedia[]) || []
    } as SubServiceWithMedia;
  } catch (err) {
    console.error('Unexpected error fetching sub-service with media:', err);
    return null;
  }
}

/**
 * Fetch all portfolio clients
 */
export async function getPortfolioClients(): Promise<PortfolioClient[]> {
  const { data, error } = await supabase
    .from('portfolio_clients')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Fetch a single portfolio client by ID with their linked services
 */
export async function getPortfolioClientById(id: string): Promise<PortfolioClientWithServices | null> {
  if (!isValidUUID(id)) return null;

  try {
    const { data, error } = await supabase
      .from('portfolio_clients')
      .select(`
        *,
        portfolio_client_services(
          service:services(
            *,
            sub_services(
              *
            )
          )
        ),
        portfolio_proof_media(sub_service_id)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching portfolio client:', error.message);
      return null;
    }
    
    if (!data) return null;
    
    // Transform junction data into a clean array of services
    const services = (data.portfolio_client_services as any[])
      ?.map(pcs => pcs.service)
      .filter(Boolean) || [];
      
    // Create a unique set of sub_service_ids that have proof media for this client
    const proofMediaSet = new Set((data.portfolio_proof_media as any[])?.map(p => p.sub_service_id) || []);
      
    return {
      ...data,
      services,
      active_sub_service_ids: Array.from(proofMediaSet)
    } as PortfolioClientWithServices;
  } catch (err) {
    console.error('Unexpected error fetching portfolio client:', err);
    return null;
  }
}

/**
 * Fetch proof media for a specific client and sub-service
 */
export async function getPortfolioProofMedia(clientId: string, subServiceId: string): Promise<PortfolioProofMedia[]> {
  if (!isValidUUID(clientId) || !isValidUUID(subServiceId)) return [];

  try {
    const { data, error } = await supabase
      .from('portfolio_proof_media')
      .select('*')
      .eq('client_id', clientId)
      .eq('sub_service_id', subServiceId)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching proof media:', error.message);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching proof media:', err);
    return [];
  }
}
