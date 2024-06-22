

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import Animated, { FadeInLeft } from 'react-native-reanimated';
import BaseScreen from '@/components/BaseScreen';
import { useTournamentDetailsById } from '@/api/turniere';
import Colors from '@/constants/Colors';
import SVG_Trennstrich from '@assets/images/Trennstrich.svg'
import CompetitionAccordion from '@/components/Custom/CompetitionAccordion';
import CompetitionAccordionList from '@/components/Custom/CompetitionAccordionList';
import { Alert } from 'react-native';



const TurnierDetailScreen = () => {

    const { id: idString } = useLocalSearchParams();
    const [collapsed, setCollapsed] = useState(true);
    const [isSticky, setIsSticky] = useState(false);  // Zustand für Sticky-Header
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0])
    const { data: turnier, error, isLoading } = useTournamentDetailsById(id)
    if (error) { console.log(error.message); }
    const handleScroll = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        setIsSticky(y >= 315); // Angenommener Wert, an dem der Header sticky wird
    };

    const handleTurnierAnmeldung = () => {
        if (turnier?.registrationEndDatetime) {
            const registrationEndDate = new Date(turnier.registrationEndDatetime).getTime();
            const currentDate = Date.now();

            if (registrationEndDate < currentDate) {
                Alert.alert("Der Anmeldezeitraum ist zu Ende");
            } else {
                Alert.alert("Zum Turnier angemeldet");
            }
        } else {
            console.log("Kein Anmeldeschlussdatum verfügbar");
        }
    };



    return (
        <BaseScreen ellipse={false} entering={FadeInLeft.duration(500)}>

            <Stack.Screen options={{ headerTransparent: true, headerBackVisible: false, headerShown: false }} />
            {isSticky && (
                <View style={{ width: '100%', height: 100, position: 'absolute', backgroundColor: '#0C0C0C' }}></View>
            )}
            {!isLoading && (
                <SafeAreaView>
                    <ScrollView style={{ marginTop: 15 }}
                        showsVerticalScrollIndicator={false}
                        stickyHeaderIndices={[2]}
                        onScroll={handleScroll}
                    >
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
                                    <Text style={styles.value}>{`${turnier?.locationZIPCode} ${turnier?.locationCity} \n${turnier?.locationName}`}</Text>
                                </View>
                            </View>
                        </View>
                        <SVG_Trennstrich style={styles.trennstrich} />

                        <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
                            <Text style={isSticky ? styles.stickyHeader : styles.Competitions}>Staffeln</Text>
                        </TouchableOpacity>
                        {!isLoading && (<CompetitionAccordionList collapsed={collapsed} sections={turnier?.competitions} />)}

                        <TouchableOpacity onPress={() => handleTurnierAnmeldung()} style={styles.button}>
                            <Text style={{ fontFamily: 'Staatliches', color: Colors.text.base, letterSpacing: 1, fontSize: 20, }}>Anmelden</Text>
                        </TouchableOpacity>
                        <View style={{ height: 50 }}></View>
                    </ScrollView>
                </SafeAreaView>
            )}

        </BaseScreen>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "white"
    },
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
    button: {
        marginTop: 50,
        borderRadius: 12,
        width: 350,
        height: 60,
        backgroundColor: '#0C0C0C',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.text.base
    }
})

export default TurnierDetailScreen