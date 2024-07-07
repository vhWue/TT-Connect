import { View, Text, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useRegisteredTournamentsByPlayer } from '@/api/turniere';
import { useInsertCompetitionRegistrationSubscription } from '@/api/turniere/subscriptions';
import BaseScreen from '@/components/BaseScreen';
import TurnierCard from '@/components/Custom/TurnierCard/TurnierCard';
import { useAuth } from '@/providers/AuthProvider';
import { DistinctPlayerTournaments } from '@/types';
import { useRouter } from 'expo-router';
import { FadeIn } from 'react-native-reanimated';

const PersonalTournamentsScreen = () => {
    const { playerProfile } = useAuth();
    const router = useRouter();
    useInsertCompetitionRegistrationSubscription();

    if (!playerProfile) {
        return <Text>Please log in to see your registered tournaments.</Text>;
    }

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
                            <TouchableOpacity onPress={() => handleOnPress(item.tournament_id)} style={styles.itemContainer}>
                                <TurnierCard data={item} />
                            </TouchableOpacity>
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
});


export default PersonalTournamentsScreen