import { supabase } from "@/app/lib/supabase";
import { InsertTables } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBookmarkedTournamentsByPlayer = (player_id: number) => {
    return useQuery({
        queryKey: ['bookmarked', player_id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('bookmarked_tournaments')
                .select('tournament_id, tournaments(*)')
                .eq('player_id', player_id);

            if (error) {
                throw new Error(error.message);
            }
            if (!data) {
                return [];
            }

            // Filtere die Daten, um nur Einträge zu behalten, bei denen das tournaments-Objekt nicht null ist
            const filteredData = data.filter((entry): entry is { tournament_id: number; tournaments: NonNullable<typeof entry.tournaments> } => entry.tournaments !== null);

            return filteredData;
        },
    });
}








export const useInsertBookmarker = () => {

    return useMutation({
        async mutationFn(data: InsertTables<'bookmarked_tournaments'>) {

            // Überprüfen, ob die Registrierung bereits existiert
            const { data: existingBookmarker, error: existingError } = await supabase
                .from('bookmarked_tournaments')
                .select('*')
                .eq('player_id', data.player_id)
                .eq('tournament_id', data.tournament_id)
                .single();

            console.log("existingBookmarker", existingBookmarker);

            if (existingError && existingError.code !== 'PGRST116') {
                // PGRST116: No rows found error, kein Problem
                throw new Error(existingError.message);
            }


            if (!existingBookmarker) {
                const { error, data: newBookmarker } = await supabase.from('bookmarked_tournaments')
                    .insert(data).select().single()
                if (error) {
                    throw new Error(error.message);
                }
                console.log("Bookmarker inserted", newBookmarker);


                return newBookmarker;
            }
        }
    })
}



export const useDeleteBookmarker = (player_id: number) => {

    return useMutation({
        async mutationFn(tournament_id: number) {
            if (!tournament_id) {
                throw new Error('bookmarker not found');
            }

            const { error } = await supabase
                .from('bookmarked_tournaments')
                .delete()
                .eq('player_id', player_id)
                .eq('tournament_id', tournament_id);

            if (error) {
                throw new Error(error.message);
            }
        }
    });
};