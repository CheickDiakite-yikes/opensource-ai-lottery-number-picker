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
      lottery_history: {
        Row: {
          checked_at: string | null
          created_at: string
          game_type: string
          id: string
          is_used: boolean | null
          is_winner: boolean | null
          numbers: number[]
          prize_amount: number | null
          special_number: number
          user_id: string
        }
        Insert: {
          checked_at?: string | null
          created_at?: string
          game_type: string
          id?: string
          is_used?: boolean | null
          is_winner?: boolean | null
          numbers: number[]
          prize_amount?: number | null
          special_number: number
          user_id: string
        }
        Update: {
          checked_at?: string | null
          created_at?: string
          game_type?: string
          id?: string
          is_used?: boolean | null
          is_winner?: boolean | null
          numbers?: number[]
          prize_amount?: number | null
          special_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lottery_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          last_generation_reset: string | null
          monthly_generations: number | null
        }
        Insert: {
          created_at?: string
          id: string
          last_generation_reset?: string | null
          monthly_generations?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_generation_reset?: string | null
          monthly_generations?: number | null
        }
        Relationships: []
      }
      winning_numbers: {
        Row: {
          created_at: string
          draw_date: string
          game_type: string
          id: string
          numbers: number[]
          special_number: number
        }
        Insert: {
          created_at?: string
          draw_date: string
          game_type: string
          id?: string
          numbers: number[]
          special_number: number
        }
        Update: {
          created_at?: string
          draw_date?: string
          game_type?: string
          id?: string
          numbers?: number[]
          special_number?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_win_rate: {
        Args: {
          user_id_param: string
        }
        Returns: {
          total_plays: number
          total_wins: number
          win_rate: number
          total_earnings: number
        }[]
      }
      can_generate_numbers: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_lottery_match: {
        Args: {
          lottery_numbers: number[]
          lottery_special_number: number
          winning_numbers: number[]
          winning_special_number: number
        }
        Returns: boolean
      }
      cleanup_old_lottery_history: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      most_common_numbers: {
        Args: {
          game_type_param: string
        }
        Returns: {
          number: number
          frequency: number
        }[]
      }
      reset_monthly_generations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
