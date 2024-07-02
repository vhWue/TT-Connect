import { supabase } from "@/app/lib/supabase";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FilterData, useFilter } from "@/providers/MapFilterProvider";
import { UserLocation } from "@/app/(user)/map";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables } from '../../types';
import { Alert } from "react-native";
import { Tables } from '../../database.types';


export const useUpcomingTournamentsList = (filter: FilterData, userLocation: UserLocation) => {
    const date = new Date().toDateString();
    const { latitude, longitude } = userLocation;
    const fetchOnlyUpcoming = filter.filterByDateUpcoming;
    const turnierTypes = filter.filterByTournamentType;
    const { maxDistance, targetLocationName } = filter;
    const { setTargetCoords } = useFilter()

    return useQuery({
        queryKey: ['tournaments', { date, filter, userLocation }],
        queryFn: async () => {

            const { data: targetTournaments, error: targetTournaments_Error } = await supabase.from('tournaments')
                .select('locationLatitude, locationLongitude')
                .ilike('locationCity', `%${targetLocationName}%`);



            if (targetTournaments_Error || targetTournaments === null) {
                throw new Error(targetTournaments_Error.message);
            }

            // Berechnung des Durchschnitts der Breiten- und Längengrade
            const totalLat = targetTournaments.reduce((sum, tournament) => sum + tournament.locationLatitude, 0);
            const totalLong = targetTournaments.reduce((sum, tournament) => sum + tournament.locationLongitude, 0);

            const averageLat = totalLat / targetTournaments.length;
            const averageLong = totalLong / targetTournaments.length;
            setTargetCoords({ latitude: averageLat, longitude: averageLong })
            const rpcParams = {
                in_latitude: averageLat,
                in_longitude: averageLong,
                in_max_distance: maxDistance
            };


            let query = supabase.rpc('gettournamentswithindistance', rpcParams);

            if (fetchOnlyUpcoming) {
                query = query.gt('registrationEndDatetime', new Date().toISOString());
            }
            if (turnierTypes.length > 0) {
                query = query.in('type', turnierTypes);
            }

            const { data, error } = await query;

            if (error) {
                throw new Error(error.message);
            }




            return data || [];
        },
    })

};

export const useTournamentDetailsById = (id: number) => {
    return useQuery({
        queryKey: ['tournaments', id],
        queryFn: async () => {
            const { data, error } = await supabase.from('tournaments').select('*,competitions(*)').eq('id', id).single();

            if (error) {
                throw new Error(error.message);
            }

            return data || [];
        },
    });
}
export const useDistinctRegions = () => {
    type dropdownCategory = {
        id: string,
        label: string;
        value: string;
        parent?: string;
    }
    return useQuery({
        queryKey: ['tournamentRegion'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_distinct_tournament_regions');
            if (error) {
                throw new Error(error.message);
            }

            // Erstellen einer eindeutigen Liste von Regionen
            const uniqueCities: string[] = [...new Set(data?.map((item) => item.locationcity))];


            // Mapping der Regionen zu Dropdown-Kategorien
            const regionsArray: dropdownCategory[] = uniqueCities.map((region) => ({
                id: uuidv4(),
                label: region,
                value: region,
            }));



            return regionsArray || [];
        },
    });
}
export const useRegisteredTournamentCompetitionsByPlayerId = (id: number) => {
    return useQuery({
        queryKey: ['tournament_registration', { playerid: id }],
        queryFn: async () => {
            const { data, error } = await supabase.from('tournament_registration').select('*').eq('player_profile_id', id);

            if (error) {
                throw new Error(error.message);
            }
            if (data === null) {
                return []
            }

            return data;
        },
    });
}

export const useInsertTournamentRegistration = () => {
    const queryClient = useQueryClient();
    const { session, playerProfile } = useAuth();
    const userId = session?.user.id;

    return useMutation({
        async mutationFn(data: InsertTables<'tournament_registration'>) {

            if (!userId) {
                throw new Error('User ID not found');
            }
            // Überprüfen, ob die Registrierung bereits existiert
            const { data: existingRegistration, error: existingError } = await supabase
                .from('tournament_registration')
                .select('*')
                .eq('player_profile_id', playerProfile.id)
                .eq('tournament_id', data.tournament_id)
                .eq('competition_id', data.competition_id)
                .single();

            if (existingError && existingError.code !== 'PGRST116') {
                // PGRST116: No rows found error, kein Problem


                throw new Error(existingError.message);
            }

            if (!existingRegistration) {
                const { error, data: newRegistration } = await supabase.from('tournament_registration')
                    .insert(data).select().single()
                if (error) {
                    throw new Error(error.message);
                }

                return newRegistration;
            }
        },
        async onSuccess(_, { id }) {
            await queryClient.invalidateQueries({ queryKey: ['tournament_registration'] })
            await queryClient.invalidateQueries({ queryKey: ['tournament_registration', id] })
        }
    })
}


export const useDeleteTournamentRegistration = () => {
    const queryClient = useQueryClient();
    const { session } = useAuth();
    const userId = session?.user.id;

    return useMutation({
        async mutationFn(id: number) {
            if (!userId) {
                throw new Error('User ID not found');
            }

            const { error } = await supabase
                .from('tournament_registration')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error(error.message);
            }


        },
        async onSuccess(_, id) {
            await queryClient.invalidateQueries({ queryKey: ['tournament_registration'] });
            await queryClient.invalidateQueries({ queryKey: ['tournament_registration', id] });
        }
    });
};


