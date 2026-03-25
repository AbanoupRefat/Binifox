import { supabase } from './supabase'
import type { Database } from './database.types'

type Project = Database['public']['Tables']['projects']['Row']
type Article = Database['public']['Tables']['articles']['Row']
type Service = Database['public']['Tables']['services']['Row']
type TeamMember = Database['public']['Tables']['team_members']['Row']
type Faq = Database['public']['Tables']['faqs']['Row']
type Stat = Database['public']['Tables']['stats']['Row']
type AboutFeature = Database['public']['Tables']['about_features']['Row']

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
  
  if (error) throw error
  return data || []
}

export async function getFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function getStats(): Promise<Stat[]> {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function getAboutFeatures(): Promise<AboutFeature[]> {
  const { data, error } = await supabase
    .from('about_features')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data || []
}
