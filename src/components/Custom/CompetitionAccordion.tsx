import Colors from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Tables } from '@/types';
import SVG_arrow_sideways from '@assets/images/arrow_sideways.svg';
import SVG_arrow_down from '@assets/images/arrow_down.svg';
import { useAuth } from '@/providers/AuthProvider';
import { useDeleteTournamentRegistration, useInsertTournamentRegistration } from '@/api/turniere';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const CompetitionAccordion = (
    { sections, multipleSelectEnabled = false, collapsed = true, registeredTournaments }:
        { sections: Tables<'competitions'>[], multipleSelectEnabled: boolean, collapsed: boolean, registeredTournaments: Tables<'tournament_registration'>[] | undefined }) => {
    const [activeSections, setActiveSections] = useState([]);
    const [multipleSelect, setMultipleSelect] = useState(multipleSelectEnabled);
    const { mutate: insertRegistration } = useInsertTournamentRegistration()
    const { mutate: deleteRegistration } = useDeleteTournamentRegistration()
    const { playerProfile } = useAuth()

    const animatedHeaderStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming('#0C0C0C', {
                duration: 400
            }),
        };
    });

    const handleTurnierAnmeldung = (competition: Tables<'competitions'>) => {

        if (competition.registrationEndDatetime) {
            const registrationEndDate = new Date(competition.registrationEndDatetime).getTime();
            const currentDate = Date.now();

            if (registrationEndDate < currentDate) {
                Alert.alert("Der Anmeldezeitraum ist zu Ende");
            } else {
                if (playerProfile && competition.tournament_id && registeredTournaments) {
                    const { isRegistered, registrationId } = checkIsRegistered(competition, playerProfile, registeredTournaments)
                    console.log("registrationId", registrationId);

                    if (!isRegistered) {
                        const newRegistration = {
                            competition_id: competition.id,
                            tournament_id: competition.tournament_id,
                            player_profile_id: playerProfile?.id
                        };

                        Alert.alert(
                            "Bestätigung",
                            "Möchten Sie sich wirklich für dieses Turnier anmelden?",
                            [
                                {
                                    text: "Abbrechen",
                                    style: "cancel"
                                },
                                {
                                    text: "Ja",
                                    onPress: () => {
                                        insertRegistration(newRegistration);
                                        Alert.alert("Registrierung erfolgreich");
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                    else {
                        if (registrationId) {
                            Alert.alert(
                                "Bestätigung",
                                "Möchten Sie Ihre Registrierung wirklich löschen?",
                                [
                                    {
                                        text: "Abbrechen",
                                        style: "cancel"
                                    },
                                    {
                                        text: "Ja",
                                        onPress: () => {
                                            deleteRegistration(registrationId);
                                            Alert.alert("Registrierung erfolgreich gelöscht");
                                        }
                                    }
                                ],
                                { cancelable: false }
                            );
                        } else {
                            Alert.alert('Hinweis', 'Sie sind bereits für diesen Wettbewerb im Turnier registriert.');
                        }
                    }

                }


            }
        } else {
            console.log("Kein Anmeldeschlussdatum verfügbar");
        }
    };

    const checkEligibility = (competition: Tables<'competitions'>, playerProfile: Tables<'player_profiles'>): boolean => {
        const isAgeGroupValid = competition.ageGroup ? competition.ageGroup.includes(playerProfile.ageGroup) : false;
        const isFedRankValid = (
            competition.fedRankFrom === null || competition.fedRankTo === null || (
                playerProfile.fedRank !== null &&
                playerProfile.fedRank >= competition.fedRankFrom &&
                playerProfile.fedRank <= competition.fedRankTo
            )
        );
        return isAgeGroupValid && isFedRankValid;
    };



    const checkPlayerProfile = (competition: Tables<'competitions'>, playerProfile: Tables<'player_profiles'>) => {
        const eligible = checkEligibility(competition, playerProfile)
        const { isRegistered } = checkIsRegistered(competition, playerProfile, registeredTournaments ?? [])
        if (eligible) {
            return (
                <TouchableOpacity onPress={() => handleTurnierAnmeldung(competition)} style={styles.button}>
                    <Text style={{ fontFamily: 'Staatliches', color: Colors.text.base, letterSpacing: 1, fontSize: 20 }}>
                        {isRegistered ? 'Abmelden' : 'Anmelden'}
                    </Text>
                </TouchableOpacity>
            );
        }



        return null;
    };

    const checkIsRegistered = (
        competition: Tables<'competitions'>,
        playerProfile: Tables<'player_profiles'>,
        registeredTournaments: Tables<'tournament_registration'>[]
    ): { isRegistered: boolean, registrationId: number | null } => {
        // Finde die Registrierung, falls vorhanden
        const registration = registeredTournaments.find(
            (reg) =>
                reg.competition_id === competition.id &&
                reg.player_profile_id === playerProfile.id
        );

        // Prüfen, ob eine Registrierung gefunden wurde
        const isRegistered = registration !== undefined;
        const registrationId = registration ? registration.id : null;

        return { isRegistered, registrationId };
    };





    const setSections = (sections) => {
        setActiveSections(sections.includes(undefined) ? [] : sections);
    };

    const renderHeader = (competition: Tables<'competitions'>, _, isActive: boolean) => {
        let registered = false
        if (playerProfile && registeredTournaments) {
            const { isRegistered } = checkIsRegistered(competition, playerProfile, registeredTournaments)
            registered = isRegistered
        }

        return (
            <Animated.View style={[styles.header, animatedHeaderStyle]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.headerText}>{competition.name}</Text>
                    {playerProfile && checkEligibility(competition, playerProfile) && (
                        <AntDesign style={{ position: 'absolute', right: 60 }} name="infocirlceo" size={24} color="#6270EA" />
                    )}
                    {playerProfile && registeredTournaments && registered && checkEligibility(competition, playerProfile) && (
                        <AntDesign style={{ position: 'absolute', right: 100 }} name="check" size={24} color="green" />
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {!isActive && <SVG_arrow_sideways style={{ marginRight: 20 }} />}
                        {isActive && <SVG_arrow_down style={{ paddingRight: 30, marginRight: 20 }} />}
                    </View>
                </View>
            </Animated.View>
        );
    };

    const renderContent = (competition: Tables<'competitions'>, _, isActive: boolean) => {
        return (
            <View style={[styles.content, isActive ? styles.active : styles.inactive]}>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Spielmodus</Text>
                    <Text style={styles.value}>
                        {competition.playmode}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>QTTR</Text>
                    <Text style={styles.value}>
                        {competition.fedRankFrom !== null && competition.fedRankTo !== null
                            ? `${competition.fedRankFrom} bis ${competition.fedRankTo}`
                            : 'unbegrenzt'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Ranglistenrelevant</Text>
                    <Text style={styles.value}>
                        {competition.fedRankValuation
                            ? `Ja`
                            : 'Nein'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Registrierung</Text>
                    <Text style={styles.value}>
                        {competition?.registrationEndDatetime
                            ? `bis ${new Date(competition.registrationEndDatetime).toLocaleDateString('de-DE')} | ${new Date(competition.registrationEndDatetime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
                            : 'Datum nicht verfügbar'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Turnierbeginn</Text>
                    <Text style={styles.value}>
                        {competition?.startDatetime
                            ? `${new Date(competition.startDatetime).toLocaleDateString('de-DE')} | ${new Date(competition.startDatetime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
                            : 'Datum nicht verfügbar'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Spielerkapazität</Text>
                    <Text style={styles.value}>
                        {competition.playerCapacityTotal !== null
                            ? `${competition.playerCapacityTotal}`
                            : 'keine Angabe'}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title_value}>Freie Plätze</Text>
                    <Text style={styles.value}>
                        {competition.playerCapacityRemaining !== null
                            ? `${competition.playerCapacityRemaining}`
                            : 'keine Angabe'}
                    </Text>
                </View>
                {playerProfile && checkPlayerProfile(competition, playerProfile)}
            </View>
        );
    };

    return (
        <View >
            <Collapsible collapsed={collapsed}>
                <Accordion
                    activeSections={activeSections}
                    sections={sections}
                    touchableComponent={TouchableOpacity}
                    expandMultiple={multipleSelect}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    duration={400}
                    onChange={setSections}
                    renderAsFlatList={false}
                    underlayColor='#0C0C0C'
                />
            </Collapsible>
        </View>
    );
};

export default CompetitionAccordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    column: {
        flexDirection: 'column',
        paddingBottom: 5
    },
    title_value: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 16,
        letterSpacing: 1,

        paddingTop: 5
    },
    value: {
        color: Colors.text.lightgray,
        fontFamily: 'sfpro_medium',
        fontSize: 16,
        lineHeight: 19,
    },
    title: {
        color: Colors.text.base,
        fontFamily: 'Staatliches',
        fontSize: 20,
        letterSpacing: 1,
        paddingLeft: 32,
        paddingTop: 5,
        paddingBottom: 15,
    },
    header: {
        backgroundColor: '#0C0C0C',
        padding: 10,
        paddingLeft: 25,

    },
    headerActive: {
        borderBottomWidth: 2,
        borderBottomColor: 'red'
    },
    headerText: {
        lineHeight: 40,
        fontSize: 16,
        fontFamily: 'sfpro_medium',
        color: Colors.text.base,
    },
    content: {
        paddingLeft: 25,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: Colors.text.base,

    },
    active: {
        backgroundColor: '#0C0C0C'
    },
    inactive: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 12,
        width: 200,
        height: 60,
        backgroundColor: '#0C0C0C',
        left: '17%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.text.base
    }
});
