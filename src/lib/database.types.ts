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
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
      }
      services: {
        Row: {
          id: string
          icon_name: string
          title: string
          display_order: number
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
          image: string
          facebook_url: string | null
          twitter_url: string | null
          instagram_url: string | null
          linkedin_url: string | null
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
          display_order: number
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
    }
  }
}
