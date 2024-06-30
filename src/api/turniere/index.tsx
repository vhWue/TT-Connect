import { supabase } from "@/app/lib/supabase";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FilterData } from "@/providers/MapFilterProvider";
import { UserLocation } from "@/app/(user)/map";



/* export const useUpcomingTournamentsList = (filter: FilterData) => {
    const date = new Date().toDateString();
    const fetchOnlyUpcoming = filter.filterByDateUpcoming;
    const turnierTypes = filter.filterByTournamentType;
    console.log("Turniertypes", turnierTypes);

    return useQuery({
        queryKey: ['tournaments', { date, filter }],
        queryFn: async () => {
            let query = supabase.from('tournaments').select('*');

            if (fetchOnlyUpcoming) {
                query = query.gt('registrationEndDatetime', new Date().toISOString());
            }

            if (turnierTypes.length > 0) {
                query = query.in('type', turnierTypes);
            }

            console.log("innerhalb");

            const { data, error } = await query;

            if (error) {
                throw new Error(error.message);
            }

            return data || [];
        },
        staleTime: 100 * 1000
    });
} */

export const useUpcomingTournamentsList = (filter: FilterData, userLocation: UserLocation) => {
    const date = new Date().toDateString();
    const { latitude, longitude } = userLocation;
    const fetchOnlyUpcoming = filter.filterByDateUpcoming;
    const turnierTypes = filter.filterByTournamentType;
    const { maxDistance } = filter;

    return useQuery({
        queryKey: ['tournaments', { date, filter, userLocation }],
        queryFn: async () => {
            const rpcParams = {
                in_latitude: latitude,
                in_longitude: longitude,
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

