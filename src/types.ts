import { Database } from '@/database.types';


export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert'];
export type Enums<T extends keyof Database['public']['Enums']> =
    Database['public']['Enums'][T];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update'];


export type CompetitionObjectArray = {
    title: string | null;
    competition: Tables<'competitions'>[]
}

export type PlayerTournaments = {
    competition_id: number;
    id: number;
    player_profile_id: number;
    registration_time: string;
    tournament_id: number;
    tournaments: Tables<'tournaments'>;
    competitions: Tables<'competitions'>;
}

export type DistinctPlayerTournaments = {

    tournament_id: number;
    bookmarked: boolean;
    tournament_data: Tables<'tournaments'>;

}