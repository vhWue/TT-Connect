

import { View, Text, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import BaseScreen from '@/components/BaseScreen';
import { useRegisteredCompetitionsByPlayer } from '@/api/turniere';
import { useAuth } from '@/providers/AuthProvider';
import { PlayerTournaments } from '@/types';
import CompetitionCard from '@/components/Custom/TurnierCard/CompetitionCard';
import { useDeleteCompetitionRegistrationSubscription } from '@/api/turniere/subscriptions';

const TurnierDetailModalScreen = () => {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0])
    useDeleteCompetitionRegistrationSubscription()
    const { playerProfile } = useAuth()
    const router = useRouter()
    if (!playerProfile) {
        return <Text>Please log in to see your registered tournaments.;</Text>
    }
    const { data, error, isLoading } = useRegisteredCompetitionsByPlayer(playerProfile?.id, id)


    { isLoading && (<ActivityIndicator size='large' style={{ position: 'absolute', left: '45%', top: '50%' }} />) }
    if (!data) {
        return <Text>Du hast dich bisher für keine Turniere angemeldet</Text>
    }
    let tournaments = data as unknown as PlayerTournaments[]
    return (
        <BaseScreen ellipse={false} marginBottom={0}>
            {!isLoading && (
                <SafeAreaView style={styles.container}>
                    <FlatList
                        style={{ zIndex: 1000, paddingTop: 20 }}
                        data={tournaments}
                        keyExtractor={(item) => item.competition_id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.itemContainer}>
                                <CompetitionCard data={item} /></TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={styles.footer} />}

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
        height: 10, // Höhe des zusätzlichen Platzes am Ende der Liste
    },
})

export default TurnierDetailModalScreen