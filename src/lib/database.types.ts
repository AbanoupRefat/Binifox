export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          image_url: string
          title: string
          category: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      news: {
        Row: {
          id: string
          image_url: string
          title: string
          author: string
          comments_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['news']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['news']['Insert']>
      }
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
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          image_url: string
          facebook_url: string
          twitter_url: string
          instagram_url: string
          linkedin_url: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          display_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>
      }
      stats: {
        Row: {
          id: string
          icon_name: string
          value: number
          label: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['stats']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['stats']['Insert']>
      }
      about_features: {
        Row: {
          id: string
          icon_name: string
          title: string
          description: string
          display_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['about_features']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['about_features']['Insert']>
      }
      pricing: {
        Row: {
          id: string
          name: string
          price: number
          description: string | null
          features: string[]
          is_popular: boolean
          display_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pricing']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['pricing']['Insert']>
      }
    }
  }
}
