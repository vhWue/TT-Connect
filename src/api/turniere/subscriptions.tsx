import { supabase } from "@/app/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useDeleteCompetitionRegistrationSubscription = () => {
    const queryClient = useQueryClient()
    useEffect(() => {
        const tournament_registration = supabase
            .channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'tournament_registration' },
                (payload) => {
                    queryClient.invalidateQueries({ queryKey: ['tournament_registration'] });
                    queryClient.invalidateQueries({ queryKey: ['player_competitions'] });
                    queryClient.invalidateQueries({ queryKey: ['player_tournaments'] });
                }
            )
            .subscribe();
        return () => {
            tournament_registration.unsubscribe();
        };
    }, []);
}
export const useInsertCompetitionRegistrationSubscription = () => {
    const queryClient = useQueryClient()
    useEffect(() => {
        const tournament_registration = supabase
            .channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'tournament_registration' },
                (payload) => {
                    queryClient.invalidateQueries({ queryKey: ['tournament_registration'] });
                    queryClient.invalidateQueries({ queryKey: ['player_competitions'] });
                    queryClient.invalidateQueries({ queryKey: ['player_tournaments'] });
                }
            )
            .subscribe();
        return () => {
            tournament_registration.unsubscribe();
        };
    }, []);
}