import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import BaseScreen from '@/components/BaseScreen'
import { useAuth } from '@/providers/AuthProvider'
import { useRegisteredCompetitionsByPlayer, useRegisteredTournamentsByPlayer } from '@/api/turniere'
import { SafeAreaView } from 'react-native-safe-area-context'
import TurnierCard from '@/components/Custom/TurnierCard/TurnierCard'
import { DistinctPlayerTournaments } from '@/types'
import { useRouter } from 'expo-router'
import { useDeleteCompetitionRegistrationSubscription, useInsertCompetitionRegistrationSubscription } from '@/api/turniere/subscriptions'

const TurnierScreen = () => {
    const { playerProfile } = useAuth()
    const router = useRouter()
    //useDeleteCompetitionRegistrationSubscription()
    useInsertCompetitionRegistrationSubscription()
    if (!playerProfile) {
        return <Text>Please log in to see your registered tournaments.;</Text>
    }
    const { data: t, error: error, isLoading: isLoading, refetch } = useRegisteredTournamentsByPlayer(playerProfile?.id)

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    { isLoading && (<ActivityIndicator size='large' style={{ position: 'absolute', left: '45%', top: '50%' }} />) }
    if (!t) {
        return <Text>Du hast dich bisher für keine Turniere angemeldet</Text>
    }
    //let tournaments = data as unknown as PlayerTournaments[]
    let tournaments = t as unknown as DistinctPlayerTournaments[]
    const handleOnPress = (id: number) => {
        router.push(`turnier_modal/${id}`);
    }
    return (
        <BaseScreen ellipse={false} marginBottom={0}>
            {!isLoading && (
                <SafeAreaView style={styles.container}>
                    <FlatList
                        style={{ zIndex: 1000, paddingTop: 20 }}
                        data={tournaments}
                        keyExtractor={(item) => item.tournament_id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleOnPress(item.tournament_id)} style={styles.itemContainer}>
                                <TurnierCard data={item} /></TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={styles.footer} />}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />

                </SafeAreaView>)}
        </BaseScreen>
    )
}
const styles = StyleSheet.create({
    text: {
        color: 'white'
    },
    container: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemContainer: {
        marginBottom: 10, // Abstand zwischen den Elementen
    },
    footer: {
        height: 100, // Höhe des zusätzlichen Platzes am Ende der Liste
    },
})
export default TurnierScreen