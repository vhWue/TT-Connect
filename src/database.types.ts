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
      bookmarked_tournaments: {
        Row: {
          created_at: string
          id: number
          player_id: number
          tournament_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          player_id: number
          tournament_id: number
        }
        Update: {
          created_at?: string
          id?: number
          player_id?: number
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookmarked_tournaments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarked_tournaments_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          ageGroup: string | null
          fedRankFrom: number | null
          fedRankRemarks: string | null
          fedRankTo: number | null
          fedRankValuation: boolean
          id: number
          name: string
          playerCapacityRemaining: number | null
          playerCapacityTotal: number | null
          playmode: string
          registrationEndDatetime: string | null
          startDatetime: string | null
          tournament_id: number | null
        }
        Insert: {
          ageGroup?: string | null
          fedRankFrom?: number | null
          fedRankRemarks?: string | null
          fedRankTo?: number | null
          fedRankValuation: boolean
          id?: number
          name: string
          playerCapacityRemaining?: number | null
          playerCapacityTotal?: number | null
          playmode: string
          registrationEndDatetime?: string | null
          startDatetime?: string | null
          tournament_id?: number | null
        }
        Update: {
          ageGroup?: string | null
          fedRankFrom?: number | null
          fedRankRemarks?: string | null
          fedRankTo?: number | null
          fedRankValuation?: boolean
          id?: number
          name?: string
          playerCapacityRemaining?: number | null
          playerCapacityTotal?: number | null
          playmode?: string
          registrationEndDatetime?: string | null
          startDatetime?: string | null
          tournament_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competitions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_profiles: {
        Row: {
          ageGroup: string
          fedRank: number | null
          id: number
          profile_id: string
        }
        Insert: {
          ageGroup?: string
          fedRank?: number | null
          id?: number
          profile_id: string
        }
        Update: {
          ageGroup?: string
          fedRank?: number | null
          id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          group: string
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          group?: string
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          group?: string
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_registration: {
        Row: {
          competition_id: number
          id: number
          player_profile_id: number
          registration_time: string
          tournament_id: number
        }
        Insert: {
          competition_id: number
          id?: number
          player_profile_id: number
          registration_time?: string
          tournament_id: number
        }
        Update: {
          competition_id?: number
          id?: number
          player_profile_id?: number
          registration_time?: string
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registration_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registration_player_profile_id_fkey"
            columns: ["player_profile_id"]
            isOneToOne: false
            referencedRelation: "player_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registration_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          endDate: string | null
          federationNickname: string | null
          fedRankValuation: boolean | null
          geo_point: unknown | null
          hostName: string | null
          id: number
          locationCity: string | null
          locationLatitude: number | null
          locationLongitude: number | null
          locationName: string | null
          locationZIPCode: string | null
          name: string
          playerCapacityRemaining: number | null
          playerCapacityTotal: number | null
          registrationEndDatetime: string | null
          startDate: string | null
          state: string
          tournamentId: string
          tournamentRegion: string | null
          type: string | null
        }
        Insert: {
          endDate?: string | null
          federationNickname?: string | null
          fedRankValuation?: boolean | null
          geo_point?: unknown | null
          hostName?: string | null
          id?: number
          locationCity?: string | null
          locationLatitude?: number | null
          locationLongitude?: number | null
          locationName?: string | null
          locationZIPCode?: string | null
          name: string
          playerCapacityRemaining?: number | null
          playerCapacityTotal?: number | null
          registrationEndDatetime?: string | null
          startDate?: string | null
          state: string
          tournamentId: string
          tournamentRegion?: string | null
          type?: string | null
        }
        Update: {
          endDate?: string | null
          federationNickname?: string | null
          fedRankValuation?: boolean | null
          geo_point?: unknown | null
          hostName?: string | null
          id?: number
          locationCity?: string | null
          locationLatitude?: number | null
          locationLongitude?: number | null
          locationName?: string | null
          locationZIPCode?: string | null
          name?: string
          playerCapacityRemaining?: number | null
          playerCapacityTotal?: number | null
          registrationEndDatetime?: string | null
          startDate?: string | null
          state?: string
          tournamentId?: string
          tournamentRegion?: string | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_bookmarked_tournaments: {
        Args: {
          p_player_id: number
          p_limit: number
          p_page_param?: string
        }
        Returns: {
          id: number
          tournamentId: string
          name: string
          startDate: string
          endDate: string
          registrationEndDatetime: string
          fedRankValuation: boolean
          type: string
          federationNickname: string
          hostName: string
          tournamentRegion: string
          locationZIPCode: string
          locationName: string
          locationCity: string
          locationLatitude: number
          locationLongitude: number
          state: string
          playerCapacityTotal: number
          playerCapacityRemaining: number
          geo_point: unknown
          bookmarked: boolean
        }[]
      }
      get_distinct_regions: {
        Args: Record<PropertyKey, never>
        Returns: {
          tournamentregion: string
        }[]
      }
      get_distinct_tournament_regions: {
        Args: Record<PropertyKey, never>
        Returns: {
          tournamentregion: string
          locationcity: string
        }[]
      }
      get_distinct_tournaments_by_player: {
        Args: {
          player_id_param: number
        }
        Returns: {
          tournament_id: number
          tournament_data: Json
        }[]
      }
      get_filtered_tournaments_with_distance_agegroup: {
        Args: {
          in_latitude: number
          in_longitude: number
          in_max_distance: number
          in_age_group: string
        }
        Returns: {
          id: number
          tournamentId: string
          name: string
          startDate: string
          endDate: string
          registrationEndDatetime: string
          fedRankValuation: boolean
          type: string
          federationNickname: string
          hostName: string
          tournamentRegion: string
          locationZIPCode: string
          locationName: string
          locationCity: string
          locationLatitude: number
          locationLongitude: number
          state: string
          playerCapacityTotal: number
          playerCapacityRemaining: number
          geo_point: unknown
        }[]
      }
      gettournamentswithindistance: {
        Args: {
          in_latitude: number
          in_longitude: number
          in_max_distance: number
        }
        Returns: {
          id: number
          tournamentId: string
          name: string
          startDate: string
          endDate: string
          registrationEndDatetime: string
          fedRankValuation: boolean
          type: string
          federationNickname: string
          hostName: string
          tournamentRegion: string
          locationZIPCode: string
          locationName: string
          locationCity: string
          locationLatitude: number
          locationLongitude: number
          state: string
          playerCapacityTotal: number
          playerCapacityRemaining: number
          geo_point: unknown
        }[]
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
