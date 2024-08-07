import { supabase } from "@/app/lib/supabase";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FilterData } from "@/providers/MapFilterProvider";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables, Tables } from '../../types';



export const useUpcomingTournamentsList = (filter: FilterData) => {
    const { playerProfile } = useAuth()
    const date = new Date().toDateString();
    const {
        maxDistance,
        targetLocationName,
        setTargetCoords,
        filterByDateUpcoming: fetchOnlyUpcoming,
        filterByTournamentType: turnierTypes,
        filterByAgeGroup
    } = filter;

    return useQuery({
        queryKey: ['tournaments', { fetchOnlyUpcoming, filterByAgeGroup, turnierTypes, targetLocationName, maxDistance }],
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

            if (filterByAgeGroup && playerProfile) {
                const rpcAGroupParams = {
                    in_latitude: averageLat,
                    in_longitude: averageLong,
                    in_max_distance: maxDistance,
                    in_age_group: playerProfile.ageGroup
                };
                query = supabase.rpc('get_filtered_tournaments_with_distance_agegroup', rpcAGroupParams);
            }

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

export const useTournamentDetailsById = (id: number, player_id: number) => {
    return useQuery({
        queryKey: ['tournaments', id],
        queryFn: async () => {
            // Abfrage der Turnierdetails
            const { data: tournamentData, error: tournamentError } = await supabase
                .from('tournaments')
                .select('*, competitions(*)')
                .eq('id', id)
                .single();

            if (tournamentError) {
                throw new Error(tournamentError.message);
            }

            // Überprüfen, ob das Turnier gebookmarkt ist
            const { data: bookmarkData, error: bookmarkError } = await supabase
                .from('bookmarked_tournaments')
                .select('*')
                .eq('player_id', player_id)
                .eq('tournament_id', id)
                .single();

            if (bookmarkError && bookmarkError.code !== 'PGRST116') {
                // PGRST116 bedeutet "Row not found", was erwartet werden kann, wenn der Eintrag nicht existiert
                throw new Error(bookmarkError.message);
            }

            // Rückgabe der Daten in der gewünschten Struktur
            return {
                bookmarked: !!bookmarkData,
                tournament: tournamentData
            };
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

            console.log(existingError);

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
            //await queryClient.invalidateQueries({ queryKey: ['tournament_registration'] })
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
            //await queryClient.invalidateQueries({ queryKey: ['tournament_registration'] });
            await queryClient.invalidateQueries({ queryKey: ['tournament_registration', id] });
        }
    });
};


export const useRegisteredCompetitionsByPlayer = (player_id: number, tournament_id: number) => {
    return useQuery({
        queryKey: ['player_competitions', player_id, tournament_id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tournament_registration')
                .select(`
                    *,
                    tournaments: tournament_id (*),
                    competitions: competition_id (*)
                `)
                .eq('player_profile_id', player_id);

            if (error) {
                throw new Error(error.message);
            }
            if (data === null) {
                return []
            }
            const filtered = data.filter((comp) => comp.tournament_id === tournament_id);
            return filtered || [];
        },
    });
}

export const useRegisteredTournamentsByPlayer = (player_id: number) => {
    return useQuery({
        queryKey: ['player_tournaments', player_id],
        queryFn: async () => {
            const { data, error } = await supabase
                .rpc('get_distinct_tournaments_by_player_with_bookmarked', { player_id_param: player_id })

            if (error) {
                throw new Error(error.message);
            }
            if (!data) {
                return [];
            }

            return data;
        },
    });
}

const LIMIT = 5;

const fetchTournaments = async ({ pageParam = null, player_id }: { pageParam: any, player_id: number }) => {


    // Rufe die gespeicherte Funktion auf
    const { data, error } = await supabase.rpc('get_bookmarked_tournaments', {
        p_player_id: player_id,
        p_limit: LIMIT,
        p_page_param: pageParam
    });

    if (error) {
        console.error("Error fetching tournaments:", error.message);
        throw new Error(error.message);
    }



    const nextPage = data.length === LIMIT ? data[data.length - 1].startDate : null;

    const processedData = data.map(tournament => {
        const { bookmarked, ...tournamentData } = tournament;
        return {
            bookmarked,
            tournament: tournamentData
        };
    });

    return {
        data: processedData,
        nextPage,
    };
};


export const useTournamentsWithInfiniteScroll = () => {
    const { playerProfile } = useAuth()
    return useInfiniteQuery<FetchTournamentsResponse, Error>({
        queryKey: ['tournament_infiniteScroll', playerProfile.id],
        queryFn: ({ pageParam = null }) => fetchTournaments({ pageParam, player_id: playerProfile.id }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextPage
    });
};


interface FetchTournamentsResponse {
    data: {
        bookmarked: boolean;
        tournament: Tables<'tournaments'>;
    }[];
    nextPage: string | null;
}