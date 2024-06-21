import { supabase } from "@/app/lib/supabase";
import { useQuery } from '@tanstack/react-query';


export const useTournamentsList = ({ limit = 50 }: { limit: number }) => {
    return useQuery({
        queryKey: ['tournaments'],
        queryFn: async () => {
            const { data, error } = await supabase.from('tournaments').select('*').limit(limit);

            if (error) {
                throw new Error(error.message);
            }

            return data || [];
        },
    });
}
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

