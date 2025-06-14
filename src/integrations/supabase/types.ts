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
      daily_challenges: {
        Row: {
          created_at: string | null
          date: string
          difficulty: number
          hints: string[]
          id: string
          sequence: string
          solution: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          difficulty: number
          hints: string[]
          id?: string
          sequence: string
          solution: string
        }
        Update: {
          created_at?: string | null
          date?: string
          difficulty?: number
          hints?: string[]
          id?: string
          sequence?: string
          solution?: string
        }
        Relationships: []
      }
      oeis_sequences: {
        Row: {
          created_at: string | null
          description: string
          formula: string | null
          id: string
          is_public: boolean | null
          name: string
          oeis_id: string
          source: string | null
          values: string
        }
        Insert: {
          created_at?: string | null
          description: string
          formula?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          oeis_id: string
          source?: string | null
          values: string
        }
        Update: {
          created_at?: string | null
          description?: string
          formula?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          oeis_id?: string
          source?: string | null
          values?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      sequences: {
        Row: {
          author: string
          comments: number | null
          created_at: string | null
          description: string
          formula: string
          id: string
          latex_formula: string
          title: string
          votes: number | null
        }
        Insert: {
          author: string
          comments?: number | null
          created_at?: string | null
          description: string
          formula: string
          id?: string
          latex_formula: string
          title: string
          votes?: number | null
        }
        Update: {
          author?: string
          comments?: number | null
          created_at?: string | null
          description?: string
          formula?: string
          id?: string
          latex_formula?: string
          title?: string
          votes?: number | null
        }
        Relationships: []
      }
      sequences_library: {
        Row: {
          author: string | null
          author_name: string
          complexity: number
          created_at: string
          description: string
          example_values: string | null
          formula: string
          id: string
          latex_formula: string
          tags: string[] | null
          title: string
          votes: number | null
        }
        Insert: {
          author?: string | null
          author_name: string
          complexity?: number
          created_at?: string
          description: string
          example_values?: string | null
          formula: string
          id?: string
          latex_formula: string
          tags?: string[] | null
          title: string
          votes?: number | null
        }
        Update: {
          author?: string | null
          author_name?: string
          complexity?: number
          created_at?: string
          description?: string
          example_values?: string | null
          formula?: string
          id?: string
          latex_formula?: string
          tags?: string[] | null
          title?: string
          votes?: number | null
        }
        Relationships: []
      }
      special_numbers: {
        Row: {
          author: string
          created_at: string
          description: string
          formula: string | null
          id: string
          name: string
          number: string
        }
        Insert: {
          author: string
          created_at?: string
          description: string
          formula?: string | null
          id?: string
          name: string
          number: string
        }
        Update: {
          author?: string
          created_at?: string
          description?: string
          formula?: string | null
          id?: string
          name?: string
          number?: string
        }
        Relationships: []
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
