import { View, Text, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useRegisteredTournamentsByPlayer } from '@/api/turniere';
import { useDeleteBookmarkSubscription, useInsertBookmarkSubscription, useInsertCompetitionRegistrationSubscription } from '@/api/turniere/subscriptions';
import BaseScreen from '@/components/BaseScreen';
import TurnierCard from '@/components/Custom/TurnierCard/TurnierCard';
import { useAuth } from '@/providers/AuthProvider';
import { DistinctPlayerTournaments, Tables } from '@/types';
import { useRouter } from 'expo-router';
import { FadeIn } from 'react-native-reanimated';
import SVG_active_Bookmark from '@assets/images/active_bookmark.svg';
import SVG_inactive_Bookmark from '@assets/images/material-symbols_bookmark-outline.svg';
import { useDeleteBookmarker, useInsertBookmarker } from '@/api/turniere/bookmarker';

const PersonalTournamentsScreen = () => {
    const { playerProfile } = useAuth();
    if (!playerProfile) {
        return <Text>Please log in to see your registered tournaments.</Text>;
    }
    const router = useRouter();
    useInsertCompetitionRegistrationSubscription();
    useDeleteBookmarkSubscription(playerProfile.id)
    useInsertBookmarkSubscription(playerProfile.id)
    const { mutate: insertBookmarker } = useInsertBookmarker()
    const { mutate: deleteBookmarker } = useDeleteBookmarker(playerProfile?.id)
    const { data: t, error: error, isLoading: isLoading, refetch } = useRegisteredTournamentsByPlayer(playerProfile?.id);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleOnPress = (id: number) => {
        router.push(`turnier_modal/${id}`);
    }



    if (isLoading) {
        return <ActivityIndicator size='large' style={{ position: 'absolute', left: '45%', top: '50%' }} />;
    }

    if (!t) {
        return <Text>Du hast dich bisher für keine Turniere angemeldet</Text>;
    }
    const handleBookmarker = (bookmarked: boolean, tournament: Tables<'tournaments'>) => {
        if (!bookmarked) {
            const newBookmarker = {
                player_id: playerProfile.id,
                tournament_id: tournament.id
            }
            insertBookmarker(newBookmarker)
        }
        if (bookmarked) {
            deleteBookmarker(tournament.id)
        }


    }
    let tournaments = t as unknown as DistinctPlayerTournaments[];

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
                                    <TouchableOpacity onPress={() => handleBookmarker(item.bookmarked, item.tournament_data)}>
                                        {item.bookmarked ? <SVG_active_Bookmark /> : <SVG_inactive_Bookmark />}
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => handleOnPress(item.tournament_id)} style={styles.itemContainer}>
                                    <TurnierCard data={item} />
                                </TouchableOpacity>
                            </View>

                        )}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={styles.footer} />}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
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


export default PersonalTournamentsScreen