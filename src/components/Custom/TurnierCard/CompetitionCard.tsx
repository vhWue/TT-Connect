import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import Colors from '@/constants/Colors'
import SVG_Bookmark from '@assets/images/material-symbols_bookmark-outline.svg'
import SVG_Clock from '@assets/images/clock.svg'
import TurnierStateBadge from './TurnierStateBadge'
import FedRankBadge from './FedRankBadge'
import SVG_woman from '@assets/images/persons/Single_Woman.svg'
import SVG_men from '@assets/images/persons/Single_Men.svg'
import SVG_mixed from '@assets/images/persons/Mixed.svg'
import { DistinctPlayerTournaments, PlayerTournaments, Tables } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { useDeleteTournamentRegistration } from '@/api/turniere'

const CompetitionCard = ({ data }: { data: PlayerTournaments | undefined }) => {
    const { mutate: deleteRegistration } = useDeleteTournamentRegistration()

    const FedValidator = (fedFrom: number | null, fedTo: number | null) => {

        if (fedFrom === null || fedTo === null) {
            return <FedRankBadge grenze='>' fedRank={fedFrom} />
        }
        else {
            return (
                <>
                    <FedRankBadge grenze='>' fedRank={fedFrom} />
                    <FedRankBadge grenze='<' fedRank={fedTo} />
                </>
            )
        }


    }
    const iconSelector = (ageGroup: string | null, size: number) => {
        if (ageGroup === null) {
            return
        }
        if (ageGroup.startsWith('U')) {
            return <SVG_mixed width={size} height={size} />;
        }

        switch (ageGroup) {
            case 'Damen':
                return <SVG_woman width={size} height={size} />;
            case 'Seniorinnen':
                return <SVG_woman width={size} height={size} />;
            case 'Herren':
                return <SVG_men width={size} height={size} />;
            case 'Senioren':
                return <SVG_men width={size} height={size} />;
            case 'Mixed':
                return <SVG_mixed width={size} height={size} />;
            case 'Herren/Damen':
                return <SVG_mixed width={size} height={size} />;
            case 'Damen/Herren':
                return <SVG_mixed width={size} height={size} />;
            case 'Junioren':
                return <SVG_mixed width={size} height={size} />;
            default:
                return <SVG_mixed width={size} height={size} />; // Optional: Rendern Sie einen Platzhalter oder eine Standard-Icon, wenn ageGroup nicht erkannt wird
        }
    }

    const handleTurnierAnmeldung = (id: number) => {
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
                        deleteRegistration(id);
                        Alert.alert("Registrierung erfolgreich gelöscht");
                    }
                }
            ],
            { cancelable: false }
        );
    };




    return (
        <View>
            {
                data && (
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <View style={{ flexDirection: 'row', gap: 15 }}>
                                <Image
                                    source={require('@assets/images/cardImages/malong.jpg')}
                                    resizeMode='cover'
                                    style={styles.imagePreviewCircle} />

                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', flexShrink: 1 }}>
                                        <Text style={styles.headerText}>{data?.competitions.name}</Text>
                                    </View>
                                    <Text style={styles.subheaderText}>{`${data?.competitions.playmode}`}</Text>
                                </View>
                            </View>
                            <SVG_Bookmark style={styles.bookmark} />
                            <View style={styles.badges}>
                                {FedValidator(data.competitions.fedRankFrom, data.competitions.fedRankTo)}
                                <TurnierStateBadge state={data?.tournaments.state ?? ''} />
                            </View>
                        </View>
                        <View style={styles.separator}></View>
                        <View style={styles.SubInformationBadges}>
                            <View style={styles.SubInformationBadge}>
                                <View style={styles.ellipse}>
                                    <SVG_Clock width={18} height={18} />
                                </View>
                                <Text style={styles.SubInformationBadgeText}>
                                    {data?.tournaments.startDate ? `${new Date(data?.tournaments.startDate).toLocaleDateString('de-DE')}` : 'Datum nicht verfügbar'}
                                </Text>
                            </View>
                            <View style={[styles.SubInformationBadge, styles.badgeMarginLeft]}>
                                <View style={styles.ellipse}>
                                    <FontAwesome name="map-marker" size={20} color={Colors.text.base} />
                                </View>
                                <Text style={styles.SubInformationBadgeText}>{`${data?.tournaments.locationZIPCode} | ${data?.tournaments.locationCity}`}</Text>

                            </View>
                            <View style={[styles.SubInformationBadge, styles.badgeMarginTop]}>
                                <View style={styles.ellipse}>
                                    {iconSelector(data?.competitions.ageGroup ?? '', 20)}
                                </View>
                                <Text style={styles.SubInformationBadgeText}>
                                    Teilnehmeranzahl: {data.competitions.playerCapacityTotal ?? 'Nicht angegeben'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleTurnierAnmeldung(data.id)} style={styles.button}>
                            <Text style={{ fontFamily: 'Staatliches', color: Colors.text.base, letterSpacing: 1, fontSize: 20 }}>
                                Abmelden
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 360,

        borderRadius: 24,
        borderColor: '#000000',
        borderWidth: 2,
        backgroundColor: 'rgba(19, 19, 19, 0.8)',
        paddingBottom: 15,
    },
    headerContainer: {
        paddingLeft: 15,
        paddingTop: 15,
    },
    headerText: {
        color: Colors.text.base,
        fontFamily: 'sfpro_bold',
        fontSize: 16,
    },
    subheaderText: {
        color: Colors.text.lightgray,
        fontFamily: 'sfpro_bold',
        fontSize: 14,
        paddingTop: 5
    },
    imagePreviewCircle: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },
    bookmark: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    separator: {
        width: 330,
        height: 1,
        alignSelf: 'center',
        backgroundColor: 'rgba(186, 186, 186, 0.3)'
    },
    badges: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 5,
        paddingTop: 18,
        paddingBottom: 12
    },
    ellipse: {
        width: 30, height: 30,
        borderRadius: 50,
        backgroundColor: '#131313',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black'
    },
    SubInformationBadges: {
        paddingLeft: 15,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },
    SubInformationBadge: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    badgeMarginLeft: {
        marginLeft: 15
    },
    badgeMarginTop: {
        marginTop: 10
    },
    SubInformationBadgeText: {
        fontFamily: 'Staatliches',
        fontSize: 15,
        letterSpacing: 1,
        color: Colors.text.lightgray
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 12,
        width: 200,
        height: 60,
        backgroundColor: '#0C0C0C',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.text.base
    }
})


export default CompetitionCard