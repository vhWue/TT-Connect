import { supabase } from "@/app/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useDeleteCompetitionRegistrationSubscription = () => {
    const queryClient = useQueryClient()
    useEffect(() => {
        const tournament_registration = supabase
            .channel('delete_CompetitionRegistration')
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
            .channel('insert_CompetitionRegistration')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'tournament_registration' },
                (payload) => {
                    console.log("zu Turnier angemeldet");

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

export const useDeleteBookmarkSubscription = (playerId: number) => {
    const queryClient = useQueryClient()
    useEffect(() => {
        const bookmark_registration = supabase
            .channel('delete_bookmark')
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'bookmarked_tournaments' },
                (payload) => {
                    console.log("useDeleteBookmarkSubscription");
                    queryClient.invalidateQueries({ queryKey: ['tournament_infiniteScroll', playerId] });
                    queryClient.invalidateQueries({ queryKey: ['player_tournaments', playerId] });
                    queryClient.invalidateQueries({ queryKey: ['bookmarked', playerId] });

                }
            )
            .subscribe();
        return () => {
            bookmark_registration.unsubscribe();
        };
    }, []);
}
export const useInsertBookmarkSubscription = (playerId: number) => {
    const queryClient = useQueryClient()
    useEffect(() => {
        const bookmark_registration = supabase
            .channel('insert_bookmark')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bookmarked_tournaments' },
                (payload) => {
                    console.log("useInsertBookmarkSubscription");
                    queryClient.invalidateQueries({ queryKey: ['tournament_infiniteScroll', playerId] });
                    queryClient.invalidateQueries({ queryKey: ['player_tournaments', playerId] });
                    queryClient.invalidateQueries({ queryKey: ['bookmarked', playerId] });
                }
            )
            .subscribe();
        return () => {
            bookmark_registration.unsubscribe();
        };
    }, []);
}