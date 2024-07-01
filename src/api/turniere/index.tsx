import { supabase } from "@/app/lib/supabase";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FilterData, useFilter } from "@/providers/MapFilterProvider";
import { UserLocation } from "@/app/(user)/map";
import { v4 as uuidv4 } from 'uuid';


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
            console.log("Anzahl unique ", uniqueCities.length);

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


