

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { FadeInLeft } from 'react-native-reanimated';
import BaseScreen from '@/components/BaseScreen';
import { useRegisteredTournamentCompetitionsByPlayerId, useTournamentDetailsById } from '@/api/turniere';
import Colors from '@/constants/Colors';
import SVG_Trennstrich from '@assets/images/Trennstrich.svg'
import CompetitionAccordionList from '@/components/Custom/CompetitionAccordionList';

import { useAuth } from '@/providers/AuthProvider';
import SVG_active_Bookmark from '@assets/images/active_bookmark.svg';
import SVG_inactive_Bookmark from '@assets/images/material-symbols_bookmark-outline.svg';
import { Tables } from '@/types';
import { useInsertBookmarker, useDeleteBookmarker } from '@/api/turniere/bookmarker';
import { useInsertCompetitionRegistrationSubscription, useInsertBookmarkSubscription, useDeleteBookmarkSubscription } from '@/api/turniere/subscriptions';


const TurnierDetailScreen = () => {
    const { playerProfile } = useAuth()
    const { id: idString } = useLocalSearchParams();
    if (!playerProfile) {
        return <Text>Spielerprofil konnte nicht gefunden werden</Text>
    }
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0])
    const { data, error, isLoading, isPending } = useTournamentDetailsById(id, playerProfile.id)

    useInsertCompetitionRegistrationSubscription();
    useInsertBookmarkSubscription(playerProfile.id)
    useDeleteBookmarkSubscription(playerProfile.id, id)
    const { mutate: insertBookmarker } = useInsertBookmarker()
    const { mutate: deleteBookmarker } = useDeleteBookmarker(playerProfile?.id)
    const { data: registeredTournaments, error: registeredTournaments_error } = useRegisteredTournamentCompetitionsByPlayerId(playerProfile.id)
    const [collapsed, setCollapsed] = useState(true);
    const [isSticky, setIsSticky] = useState(false);  // Zustand für Sticky-Header

    if (error) { console.log(error.message); }
    const handleScroll = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        setIsSticky(y >= 315); // Angenommener Wert, an dem der Header sticky wird
    };


    const handleBookmarker = (bookmarked: boolean, tournament_id: number) => {
        if (!bookmarked) {
            const newBookmarker = {
                player_id: playerProfile.id,
                tournament_id: tournament_id
            }
            insertBookmarker(newBookmarker)
        } else if (bookmarked) {
            deleteBookmarker(tournament_id)
        }


    }






    return (
        <BaseScreen ellipse={false} entering={FadeInLeft.duration(500)}>
            {isLoading && (<ActivityIndicator size='large' style={{ position: 'absolute', left: '45%', top: '50%' }} />)}

            <Stack.Screen options={{ headerTransparent: true, headerBackVisible: false, headerShown: false }} />
            {isSticky && (
                <View style={{ width: '100%', height: 100, position: 'absolute', backgroundColor: '#0C0C0C' }}></View>
            )}
            {!isLoading && data && data.tournament && (
                <SafeAreaView>
                    <ScrollView style={{ marginTop: 15 }}
                        showsVerticalScrollIndicator={false}
                        stickyHeaderIndices={[2]}
                        onScroll={handleScroll}
                    >
                        <View style={styles.container}>
                            <Text style={styles.header}>{data?.tournament.name}</Text>
                            <View style={styles.overlay}>
                                <TouchableOpacity onPress={() => handleBookmarker(data.bookmarked, data?.tournament.id)}>
                                    {data.bookmarked ? <SVG_active_Bookmark /> : <SVG_inactive_Bookmark />}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.subheader}>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Turnierart</Text>
                                    <Text style={styles.value}>{data?.tournament.type?.toUpperCase()}</Text>
                                </View>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Anmeldung bis</Text>
                                    <Text style={styles.value}>
                                        {data?.tournament?.registrationEndDatetime ? `${new Date(data?.tournament.registrationEndDatetime).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })} | ${new Date(data?.tournament.registrationEndDatetime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr` : 'Datum nicht verfügbar'}

                                    </Text>
                                </View>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Start</Text>
                                    <Text style={styles.value}>
                                        {data?.tournament.startDate ? `${new Date(data.tournament?.startDate).toLocaleDateString('de-DE')}` : 'Datum nicht verfügbar'}
                                    </Text>
                                </View>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Verband</Text>
                                    <Text style={styles.value}>{data?.tournament.federationNickname}</Text>
                                </View>
                                <View style={styles.inline}>
                                    <Text style={styles.title}>Veranstalter</Text>
                                    <Text style={styles.value}>{`${data?.tournament.hostName}`}</Text>
                                </View>

                                <View style={styles.inline}>
                                    <Text style={styles.title}>Austragungsort</Text>
                                    <Text style={styles.value}>{`${data?.tournament.locationZIPCode} ${data?.tournament.locationCity} \n${data?.tournament.locationName}`}</Text>
                                </View>
                            </View>
                        </View>
                        <SVG_Trennstrich style={styles.trennstrich} />

                        <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
                            <Text style={isSticky ? styles.stickyHeader : styles.Competitions}>Staffeln</Text>
                        </TouchableOpacity>
                        {!isLoading && (<CompetitionAccordionList registeredTournaments={registeredTournaments} collapsed={collapsed} sections={data?.tournament.competitions} />)}
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
        paddingTop: 30
    },
    inline: {
        flexDirection: 'row',
        paddingBottom: 5
    },
    title: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 20,
        letterSpacing: 1,
        paddingRight: 5
    },
    value: {
        color: Colors.text.lightgray,
        fontFamily: 'sfpro_medium',
        fontSize: 18,
        lineHeight: 24
    },
    container: {
        alignItems: 'flex-start',
        paddingLeft: 15,
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
    stickyHeader: {
        backgroundColor: '#0C0C0C',  // Hintergrundfarbe, wenn sticky
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 20,
        letterSpacing: 1,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 15,
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
})

export default TurnierDetailScreen