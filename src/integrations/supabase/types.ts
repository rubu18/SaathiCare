export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          admin_email: string | null
          created_at: string | null
          event_description: string | null
          event_ip: string | null
          event_result: string
          event_type: string
          id: string
        }
        Insert: {
          admin_email?: string | null
          created_at?: string | null
          event_description?: string | null
          event_ip?: string | null
          event_result: string
          event_type: string
          id?: string
        }
        Update: {
          admin_email?: string | null
          created_at?: string | null
          event_description?: string | null
          event_ip?: string | null
          event_result?: string
          event_type?: string
          id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          appointment_date: string
          appointment_time: string
          companion_id: string
          created_at: string
          doctor_name: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          hospital_address: string | null
          hospital_name: string
          id: string
          patient_age: number | null
          patient_name: string
          phone: string
          platform_fee: number
          service_fee: number
          special_requirements: string | null
          status: string | null
          total_amount: number
          updated_at: string
          visit_type: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          companion_id: string
          created_at?: string
          doctor_name?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          hospital_address?: string | null
          hospital_name: string
          id?: string
          patient_age?: number | null
          patient_name: string
          phone: string
          platform_fee: number
          service_fee: number
          special_requirements?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string
          visit_type?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          companion_id?: string
          created_at?: string
          doctor_name?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          hospital_address?: string | null
          hospital_name?: string
          id?: string
          patient_age?: number | null
          patient_name?: string
          phone?: string
          platform_fee?: number
          service_fee?: number
          special_requirements?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string
          visit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          id: string
          last_message: string | null
          last_message_time: string | null
          member_ids: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          member_ids: string[]
        }
        Update: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          member_ids?: string[]
        }
        Relationships: []
      }
      companions: {
        Row: {
          age: number
          bio: string | null
          created_at: string
          experience: string
          id: string
          join_date: string | null
          languages: string[] | null
          location: string
          name: string
          price: string
          rating: number | null
          reviews: number | null
          specialties: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          age: number
          bio?: string | null
          created_at?: string
          experience: string
          id?: string
          join_date?: string | null
          languages?: string[] | null
          location: string
          name: string
          price: string
          rating?: number | null
          reviews?: number | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          age?: number
          bio?: string | null
          created_at?: string
          experience?: string
          id?: string
          join_date?: string | null
          languages?: string[] | null
          location?: string
          name?: string
          price?: string
          rating?: number | null
          reviews?: number | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string
          beds_available: number | null
          city: string
          created_at: string
          description: string | null
          email: string | null
          emergency_services: boolean | null
          facilities: string[] | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          pincode: string | null
          rating: number | null
          specialties: string[] | null
          state: string
          total_beds: number | null
          total_reviews: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          beds_available?: number | null
          city: string
          created_at?: string
          description?: string | null
          email?: string | null
          emergency_services?: boolean | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          pincode?: string | null
          rating?: number | null
          specialties?: string[] | null
          state: string
          total_beds?: number | null
          total_reviews?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          beds_available?: number | null
          city?: string
          created_at?: string
          description?: string | null
          email?: string | null
          emergency_services?: boolean | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          pincode?: string | null
          rating?: number | null
          specialties?: string[] | null
          state?: string
          total_beds?: number | null
          total_reviews?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      hotels: {
        Row: {
          address: string
          amenities: string[] | null
          city: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          pincode: string | null
          price_range: string | null
          rating: number | null
          room_types: string[] | null
          rooms_available: number | null
          star_rating: number | null
          state: string
          total_reviews: number | null
          total_rooms: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          city: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          pincode?: string | null
          price_range?: string | null
          rating?: number | null
          room_types?: string[] | null
          rooms_available?: number | null
          star_rating?: number | null
          state: string
          total_reviews?: number | null
          total_rooms?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          city?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          pincode?: string | null
          price_range?: string | null
          rating?: number | null
          room_types?: string[] | null
          rooms_available?: number | null
          star_rating?: number | null
          state?: string
          total_reviews?: number | null
          total_rooms?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
