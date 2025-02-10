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
      anonymous_generations: {
        Row: {
          created_at: string | null
          fingerprint: string
          game_type: string
          id: string
          last_generation_reset: string | null
          monthly_generations: number | null
        }
        Insert: {
          created_at?: string | null
          fingerprint: string
          game_type: string
          id?: string
          last_generation_reset?: string | null
          monthly_generations?: number | null
        }
        Update: {
          created_at?: string | null
          fingerprint?: string
          game_type?: string
          id?: string
          last_generation_reset?: string | null
          monthly_generations?: number | null
        }
        Relationships: []
      }
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
          last_streak_date: string | null
          level: string | null
          luck_meter: number | null
          monthly_generations: number | null
          referral_bonus_generations: number | null
          referred_by: string | null
          streak_count: number | null
          total_generations: number | null
        }
        Insert: {
          created_at?: string
          id: string
          last_generation_reset?: string | null
          last_streak_date?: string | null
          level?: string | null
          luck_meter?: number | null
          monthly_generations?: number | null
          referral_bonus_generations?: number | null
          referred_by?: string | null
          streak_count?: number | null
          total_generations?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_generation_reset?: string | null
          last_streak_date?: string | null
          level?: string | null
          luck_meter?: number | null
          monthly_generations?: number | null
          referral_bonus_generations?: number | null
          referred_by?: string | null
          streak_count?: number | null
          total_generations?: number | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      winning_numbers: {
        Row: {
          created_at: string
          draw_date: string
          game_type: string
          id: string
          next_draw: string | null
          numbers: number[]
          special_number: number
        }
        Insert: {
          created_at?: string
          draw_date: string
          game_type: string
          id?: string
          next_draw?: string | null
          numbers: number[]
          special_number: number
        }
        Update: {
          created_at?: string
          draw_date?: string
          game_type?: string
          id?: string
          next_draw?: string | null
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
      can_generate_anonymous:
        | {
            Args: {
              fingerprint_param: string
            }
            Returns: boolean
          }
        | {
            Args: {
              fingerprint_param: string
              game_type_param: string
            }
            Returns: boolean
          }
      can_generate_numbers: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_is_admin: {
        Args: {
          user_id_param: string
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
      generate_unique_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_admin_check: {
        Args: {
          user_id: string
        }
        Returns: boolean
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
      process_referral: {
        Args: {
          referrer_id: string
          referred_id: string
        }
        Returns: undefined
      }
      reset_monthly_generations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
