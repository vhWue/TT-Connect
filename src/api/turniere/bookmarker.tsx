import { supabase } from "@/app/lib/supabase";
import { InsertTables } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInsertBookmarker = () => {
    const queryClient = useQueryClient();


    return useMutation({
        async mutationFn(data: InsertTables<'bookmarked_tournaments'>) {

            // Überprüfen, ob die Registrierung bereits existiert
            const { data: existingBookmarker, error: existingError } = await supabase
                .from('bookmarked_tournaments')
                .select('*')
                .eq('player_id', data.player_id)
                .eq('tournament_id', data.tournament_id)
                .single();

            if (existingError && existingError.code !== 'PGRST116') {
                // PGRST116: No rows found error, kein Problem


                throw new Error(existingError.message);
            }


            if (!existingBookmarker) {
                console.log("Kein Bookmarker vorhanden");

                const { error, data: newBookmarker } = await supabase.from('bookmarked_tournaments')
                    .insert(data).select().single()
                if (error) {
                    throw new Error(error.message);
                }

                return newBookmarker;
            }
        },
        async onSuccess(_, { player_id }) {
            await queryClient.invalidateQueries({ queryKey: ['tournament_infiniteScroll', player_id] })

        }
    })
}



export const useDeleteBookmarker = (player_id: number) => {
    const queryClient = useQueryClient();

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


        },
        async onSuccess(_) {
            await queryClient.invalidateQueries({ queryKey: ['tournament_infiniteScroll', player_id] });

        }
    });
};