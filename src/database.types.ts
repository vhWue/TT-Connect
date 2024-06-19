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
      tournaments: {
        Row: {
          endDate: string | null
          federationNickname: string | null
          fedRankValuation: boolean | null
          hostName: string
          id: number
          locationCity: string
          locationLatitude: number | null
          locationLongitude: number | null
          locationName: string
          locationZIPCode: string
          name: string
          playerCapacityRemaining: number | null
          playerCapacityTotal: number | null
          registrationEndDatetime: string | null
          startDate: string | null
          state: string
          tournamentId: string
          tournamentRegion: string
          type: string
        }
        Insert: {
          endDate?: string | null
          federationNickname?: string | null
          fedRankValuation?: boolean | null
          hostName: string
          id?: number
          locationCity: string
          locationLatitude?: number | null
          locationLongitude?: number | null
          locationName: string
          locationZIPCode: string
          name: string
          playerCapacityRemaining?: number | null
          playerCapacityTotal?: number | null
          registrationEndDatetime?: string | null
          startDate?: string | null
          state: string
          tournamentId: string
          tournamentRegion: string
          type: string
        }
        Update: {
          endDate?: string | null
          federationNickname?: string | null
          fedRankValuation?: boolean | null
          hostName?: string
          id?: number
          locationCity?: string
          locationLatitude?: number | null
          locationLongitude?: number | null
          locationName?: string
          locationZIPCode?: string
          name?: string
          playerCapacityRemaining?: number | null
          playerCapacityTotal?: number | null
          registrationEndDatetime?: string | null
          startDate?: string | null
          state?: string
          tournamentId?: string
          tournamentRegion?: string
          type?: string
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
