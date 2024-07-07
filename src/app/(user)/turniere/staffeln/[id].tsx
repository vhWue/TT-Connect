

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import BaseScreen from '@/components/BaseScreen';
import { useInsertTournamentRegistration, useRegisteredTournamentCompetitionsByPlayerId, useTournamentDetailsById } from '@/api/turniere';
import Colors from '@/constants/Colors';
import SVG_Trennstrich from '@assets/images/Trennstrich.svg'
import CompetitionAccordionList from '@/components/Custom/CompetitionAccordionList';
import { Alert } from 'react-native';
import { Tables } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { useInsertCompetitionRegistrationSubscription } from '@/api/turniere/subscriptions';

const TurnierStaffelnModalScreen = () => {
    const { id: idString } = useLocalSearchParams();
    const { playerProfile } = useAuth()
    const playerID = playerProfile === null ? 0 : playerProfile.id
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0])
    const { data: registeredTournaments, error: registeredTournaments_error } = useRegisteredTournamentCompetitionsByPlayerId(playerID)
    const [collapsed, setCollapsed] = useState(true);
    const { data: turnier, error, isLoading, isPending } = useTournamentDetailsById(id)
    if (error) { console.log(error.message); }

    return (
        <BaseScreen ellipse={false} >
            {isLoading && (<ActivityIndicator size='large' style={{ position: 'absolute', left: '45%', top: '50%' }} />)}


            {!isLoading && (
                <SafeAreaView>
                    <ScrollView style={{ marginTop: 15 }} showsVerticalScrollIndicator={false}>
                        <View style={styles.container}>
                            <Text style={styles.header}>{turnier?.name}</Text>
                            <View style={styles.subheader}>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Turnierart</Text>
                                    <Text style={styles.value}>{turnier?.type.toUpperCase()}</Text>
                                </View>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Anmeldung bis</Text>
                                    <Text style={styles.value}>
                                        {turnier?.registrationEndDatetime ? `${new Date(turnier.registrationEndDatetime).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })} | ${new Date(turnier.registrationEndDatetime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr` : 'Datum nicht verfügbar'}

                                    </Text>
                                </View>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Start</Text>
                                    <Text style={styles.value}>
                                        {turnier?.startDate ? `${new Date(turnier?.startDate).toLocaleDateString('de-DE')}` : 'Datum nicht verfügbar'}
                                    </Text>
                                </View>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Verband</Text>
                                    <Text style={styles.value}>{turnier?.federationNickname}</Text>
                                </View>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Veranstalter</Text>
                                    <Text style={styles.value}>{`${turnier?.hostName}`}</Text>
                                </View>

                                <View style={styles.inline}>
                                    <Text style={styles.title}>Austragungsort</Text>
                                    <Text style={styles.value}>{`${turnier?.locationZIPCode} | ${turnier?.locationCity} \n${turnier?.locationName}`}</Text>
                                </View>
                            </View>
                        </View>
                        <SVG_Trennstrich style={styles.trennstrich} />

                        <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
                            <Text style={styles.Competitions}>Staffeln</Text>
                        </TouchableOpacity>
                        {!isLoading && (<CompetitionAccordionList registeredTournaments={registeredTournaments} collapsed={collapsed} sections={turnier?.competitions} />)}
                        <View style={{ height: 50 }}></View>
                    </ScrollView>
                </SafeAreaView>
            )}

        </BaseScreen>
    )
}

const styles = StyleSheet.create({
    header: {
        color: Colors.text.base,
        fontFamily: 'sfpro_bold',
        fontSize: 22,

    },
    subheader: {
        paddingTop: 30,
        flexWrap: 'wrap',
        width: '100%'
    },
    inline: {
        flexDirection: 'row',
        paddingBottom: 15
    },
    title: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 20,
        letterSpacing: 1,
        paddingRight: 5,
        flexShrink: 1,
    },
    value: {
        color: Colors.text.lightgray,
        fontFamily: 'sfpro_medium',
        fontSize: 18,
        lineHeight: 24,
        flexShrink: 1,
        flex: 1,
    },
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        paddingTop: 20
    },
    trennstrich: {
        alignSelf: 'center',
        paddingTop: 20
    },
    Competitions: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 20,
        letterSpacing: 1,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 15,
        backgroundColor: 'transparent',
    },
})

export default TurnierStaffelnModalScreen