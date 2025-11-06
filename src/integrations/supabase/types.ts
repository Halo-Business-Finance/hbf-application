export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: string
          balance: number
          created_at: string
          currency: string
          external_id: string | null
          id: string
          institution: string
          is_business: boolean
          last_synced_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: string
          balance?: number
          created_at?: string
          currency?: string
          external_id?: string | null
          id?: string
          institution: string
          is_business?: boolean
          last_synced_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          external_id?: string | null
          id?: string
          institution?: string
          is_business?: boolean
          last_synced_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      borrower_documents: {
        Row: {
          description: string | null
          document_category: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          description?: string | null
          document_category?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          description?: string | null
          document_category?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_activities: {
        Row: {
          activity_type: string
          completed_at: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          external_crm_id: string | null
          id: string
          opportunity_id: string | null
          priority: string | null
          scheduled_at: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          external_crm_id?: string | null
          id?: string
          opportunity_id?: string | null
          priority?: string | null
          scheduled_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          external_crm_id?: string | null
          id?: string
          opportunity_id?: string | null
          priority?: string | null
          scheduled_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          assigned_to: string | null
          company_name: string | null
          contact_type: string | null
          created_at: string
          custom_fields: Json | null
          email: string
          external_crm_id: string | null
          first_name: string
          id: string
          job_title: string | null
          last_contact_date: string | null
          last_name: string
          lead_source: string | null
          lead_status: string | null
          next_follow_up_date: string | null
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_name?: string | null
          contact_type?: string | null
          created_at?: string
          custom_fields?: Json | null
          email: string
          external_crm_id?: string | null
          first_name: string
          id?: string
          job_title?: string | null
          last_contact_date?: string | null
          last_name: string
          lead_source?: string | null
          lead_status?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_name?: string | null
          contact_type?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string
          external_crm_id?: string | null
          first_name?: string
          id?: string
          job_title?: string | null
          last_contact_date?: string | null
          last_name?: string
          lead_source?: string | null
          lead_status?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crm_integration_settings: {
        Row: {
          api_endpoint: string | null
          created_at: string
          external_crm_name: string
          field_mappings: Json | null
          id: string
          last_sync_at: string | null
          settings: Json | null
          sync_direction: string | null
          sync_enabled: boolean | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string
          external_crm_name?: string
          field_mappings?: Json | null
          id?: string
          last_sync_at?: string | null
          settings?: Json | null
          sync_direction?: string | null
          sync_enabled?: boolean | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string
          external_crm_name?: string
          field_mappings?: Json | null
          id?: string
          last_sync_at?: string | null
          settings?: Json | null
          sync_direction?: string | null
          sync_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      crm_opportunities: {
        Row: {
          actual_close_date: string | null
          assigned_to: string | null
          contact_id: string
          created_at: string
          custom_fields: Json | null
          expected_close_date: string | null
          external_crm_id: string | null
          id: string
          loan_amount: number | null
          loan_application_id: string | null
          loan_type: string
          loss_reason: string | null
          notes: string | null
          opportunity_name: string
          probability: number | null
          stage: string | null
          updated_at: string
        }
        Insert: {
          actual_close_date?: string | null
          assigned_to?: string | null
          contact_id: string
          created_at?: string
          custom_fields?: Json | null
          expected_close_date?: string | null
          external_crm_id?: string | null
          id?: string
          loan_amount?: number | null
          loan_application_id?: string | null
          loan_type: string
          loss_reason?: string | null
          notes?: string | null
          opportunity_name: string
          probability?: number | null
          stage?: string | null
          updated_at?: string
        }
        Update: {
          actual_close_date?: string | null
          assigned_to?: string | null
          contact_id?: string
          created_at?: string
          custom_fields?: Json | null
          expected_close_date?: string | null
          external_crm_id?: string | null
          id?: string
          loan_amount?: number | null
          loan_application_id?: string | null
          loan_type?: string
          loss_reason?: string | null
          notes?: string | null
          opportunity_name?: string
          probability?: number | null
          stage?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_opportunities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_sync_log: {
        Row: {
          created_at: string
          data_payload: Json | null
          entity_id: string | null
          entity_type: string
          error_message: string | null
          external_id: string | null
          id: string
          operation: string
          processing_time_ms: number | null
          status: string
          sync_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_payload?: Json | null
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          operation: string
          processing_time_ms?: number | null
          status: string
          sync_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_payload?: Json | null
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          operation?: string
          processing_time_ms?: number | null
          status?: string
          sync_type?: string
          user_id?: string
        }
        Relationships: []
      }
      loan_application_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          created_at: string
          id: string
          loan_application_id: string
          notes: string | null
          status: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          loan_application_id: string
          notes?: string | null
          status: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          loan_application_id?: string
          notes?: string | null
          status?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          amount_requested: number | null
          application_number: string | null
          application_started_date: string | null
          application_submitted_date: string | null
          business_address: string | null
          business_city: string | null
          business_name: string | null
          business_state: string | null
          business_zip: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          loan_details: Json | null
          loan_type: Database["public"]["Enums"]["loan_type"]
          phone: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
          years_in_business: number | null
        }
        Insert: {
          amount_requested?: number | null
          application_number?: string | null
          application_started_date?: string | null
          application_submitted_date?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string | null
          business_state?: string | null
          business_zip?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          loan_details?: Json | null
          loan_type: Database["public"]["Enums"]["loan_type"]
          phone?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
          years_in_business?: number | null
        }
        Update: {
          amount_requested?: number | null
          application_number?: string | null
          application_started_date?: string | null
          application_submitted_date?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string | null
          business_state?: string | null
          business_zip?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          loan_details?: Json | null
          loan_type?: Database["public"]["Enums"]["loan_type"]
          phone?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
          years_in_business?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_profile: {
        Args: { _first_name: string; _last_name: string; _phone: string }
        Returns: undefined
      }
    }
    Enums: {
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "funded"
      loan_type:
        | "refinance"
        | "bridge_loan"
        | "purchase"
        | "franchise"
        | "factoring"
        | "working_capital"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "funded",
      ],
      loan_type: [
        "refinance",
        "bridge_loan",
        "purchase",
        "franchise",
        "factoring",
        "working_capital",
      ],
      user_role: ["admin", "user"],
    },
  },
} as const
