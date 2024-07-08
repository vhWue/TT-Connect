import { View, Text, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useTournamentsWithInfiniteScroll } from '@/api/turniere';
import { useDeleteBookmarkSubscription, useInsertBookmarkSubscription, useInsertCompetitionRegistrationSubscription } from '@/api/turniere/subscriptions';
import BaseScreen from '@/components/BaseScreen';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { FadeIn } from 'react-native-reanimated';
import KalenderCard from '@/components/Custom/TurnierCard/KalenderCard';
import SVG_inactive_Bookmark from '@assets/images/material-symbols_bookmark-outline.svg'
import SVG_active_Bookmark from '@assets/images/active_bookmark.svg'
import { Tables } from '@/types';
import { useBookmarkedTournamentsByPlayer, useDeleteBookmarker, useInsertBookmarker } from '@/api/turniere/bookmarker';
const BookmarkerOverviewTournamentsScreen = () => {
    const { playerProfile } = useAuth();
    if (!playerProfile) {
        return <Text>Spielerprofil konnte nicht geladen werden</Text>
    }
    useInsertCompetitionRegistrationSubscription();
    useInsertBookmarkSubscription(playerProfile.id)
    useDeleteBookmarkSubscription(playerProfile.id)
    const { mutate: insertBookmarker } = useInsertBookmarker()
    const { mutate: deleteBookmarker } = useDeleteBookmarker(playerProfile?.id)
    const router = useRouter();


    const { data: tournaments, status, error, isLoading } = useBookmarkedTournamentsByPlayer(playerProfile.id);

    if (!playerProfile) {
        return <Text>Please log in to see your registered tournaments.</Text>;
    }


    const handleOnPress = (id: number) => {
        router.push(`(user)/turniere/staffeln/${id}`);
    }

    const deleteBookmarkerHandler = (tournament: Tables<'tournaments'>) => {
        deleteBookmarker(tournament.id)
    }

    if (isLoading) {
        return <ActivityIndicator size='large' style={{ position: 'absolute', left: '45%', top: '50%' }} />;
    }

    if (!tournaments) {
        return <Text>Du hast dich bisher für keine Turniere angemeldet</Text>;
    }

    return (
        <BaseScreen entering={FadeIn} ellipse={false} marginBottom={0}>
            {!isLoading && (
                <SafeAreaView style={styles.container}>
                    <FlatList
                        style={{ zIndex: 1000, paddingTop: 20 }}
                        data={tournaments}
                        keyExtractor={(item) => item.tournament_id.toString()}
                        renderItem={({ item }) => (
                            <View>
                                <View style={styles.overlay}>
                                    <TouchableOpacity onPress={() => deleteBookmarkerHandler(item.tournaments)}>
                                        <SVG_active_Bookmark />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => handleOnPress(item.tournaments.id)} style={styles.itemContainer}>
                                    <KalenderCard data={item.tournaments} />
                                </TouchableOpacity>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={styles.footer} />}
                    />
                </SafeAreaView>
            )}
        </BaseScreen>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    },
    container: {
        top: -5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        marginBottom: 10, // Abstand zwischen den Elementen
    },
    footer: {
        height: 130, // Höhe des zusätzlichen Platzes am Ende der Liste
    },
    rightAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
    },
    overlay: {
        width: 50, height: 50,
        //borderWidth: 1, borderColor: 'blue',
        position: 'absolute',
        right: 0,
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default BookmarkerOverviewTournamentsScreen