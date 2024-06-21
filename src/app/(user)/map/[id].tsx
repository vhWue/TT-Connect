

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import Animated, { FadeInLeft } from 'react-native-reanimated';
import BaseScreen from '@/components/BaseScreen';
import { useTournamentDetailsById } from '@/api/turniere';
import Colors from '@/constants/Colors';
import SVG_Trennstrich from '@assets/images/Trennstrich.svg'
import CompetitionAccordion from '@/components/Custom/CompetitionAccordion';
import CompetitionAccordionList from '@/components/Custom/CompetitionAccordionList';

const TurnierDetailScreen = () => {
    const { id: idString } = useLocalSearchParams();
    const [collapsed, setCollapsed] = useState(true);
    const [isSticky, setIsSticky] = useState(false);  // Zustand für Sticky-Header
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0])
    const { data: turnier, error, isLoading } = useTournamentDetailsById(id)
    if (!isLoading) {
        //console.log("Turnierdaten: ", turnier?.competitions);
    }
    if (error) {
        console.log(error.message);

    }
    const toggleExpanded = () => {
        console.log("BeforePressed", collapsed);

        setCollapsed(!collapsed);
        console.log("AfterPressed", collapsed);

    };
    const handleScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        setIsSticky(y >= 315); // Angenommener Wert, an dem der Header sticky wird
    };

    return (
        <BaseScreen ellipse={false} entering={FadeInLeft.duration(500)}>

            <Stack.Screen options={{ headerTransparent: true, headerBackVisible: false, headerShown: false }} />
            {isSticky && (
                <View style={{ width: '100%', height: 100, position: 'absolute', backgroundColor: '#0C0C0C' }}></View>
            )}
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
                                <Text style={styles.value}>Qualification</Text>
                            </View>
                            <View style={styles.inline}>
                                <Text style={styles.title}>Saison</Text>
                                <Text style={styles.value}>2023/24</Text>
                            </View>
                            <View style={styles.inline}>
                                <Text style={styles.title}>Verband</Text>
                                <Text style={styles.value}>BaTTV</Text>
                            </View>
                            <View style={styles.inline}>
                                <Text style={styles.title}>Veranstalter</Text>
                                <Text style={styles.value}>BJC Buchen</Text>
                            </View>
                            <View style={styles.inline}>
                                <Text style={styles.title}>Zeitraum</Text>
                                <Text style={styles.value}>24.01 - 25.01.2024</Text>
                            </View>
                            <View style={styles.inline}>
                                <Text style={styles.title}>Austragungsort</Text>
                                <Text style={styles.value}>{`97065 Würzburg \nMehrzweckhalle`}</Text>
                            </View>
                        </View>
                    </View>
                    <SVG_Trennstrich style={styles.trennstrich} />

                    <TouchableOpacity onPress={toggleExpanded}>
                        <Text style={isSticky ? styles.stickyHeader : styles.Competitions}>Competitions</Text>
                    </TouchableOpacity>
                    {!isLoading && (
                        //<CompetitionAccordion collapsed={collapsed} sections={turnier?.competitions} />
                        <CompetitionAccordionList collapsed={collapsed} sections={turnier?.competitions} />
                    )

                    }


                </ScrollView>
            </SafeAreaView>

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
        paddingLeft: 32,
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
        paddingLeft: 32,
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
        paddingLeft: 32,
        paddingTop: 5,
        paddingBottom: 15,


    },
})

export default TurnierDetailScreen