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
          clients: string[] | null
          features: string[] | null
          process_steps: string[] | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      sub_services: {
        Row: {
          id: string
          service_id: string
          title: string
          description: string | null
          image_url: string | null
          gdrive_video_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sub_services']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sub_services']['Insert']>
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
      sub_service_media: {
        Row: {
          id: string
          sub_service_id: string
          url: string
          caption: string | null
          display_order: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sub_service_media']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sub_service_media']['Insert']>
      }
      portfolio_clients: {
        Row: {
          id: string
          name: string
          description: string | null
          vision_mission: string | null
          logo_url: string | null
          category: string | null
          facebook_url: string | null
          instagram_url: string | null
          snapchat_url: string | null
          join_date: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['portfolio_clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['portfolio_clients']['Insert']>
      }
      portfolio_client_services: {
        Row: {
          id: string
          client_id: string
          service_id: string
          display_order: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['portfolio_client_services']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['portfolio_client_services']['Insert']>
      }
      portfolio_proof_media: {
        Row: {
          id: string
          client_id: string
          sub_service_id: string
          url: string
          caption: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['portfolio_proof_media']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['portfolio_proof_media']['Insert']>
      }
    }
  }
}
