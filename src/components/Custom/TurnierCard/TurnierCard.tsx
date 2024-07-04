import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import Colors from '@/constants/Colors'
import SVG_Bookmark from '@assets/images/material-symbols_bookmark-outline.svg'
import SVG_Clock from '@assets/images/clock.svg'
import TurnierStateBadge from './TurnierStateBadge'
import FedRankBadge from './FedRankBadge'
import SVG_woman from '@assets/images/persons/Single_Woman.svg'
import SVG_men from '@assets/images/persons/Single_Men.svg'
import SVG_mixed from '@assets/images/persons/Mixed.svg'
import { DistinctPlayerTournaments, PlayerTournaments } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import TurnierTypeBadge from './TurnierTypeBadge'

const TurnierCard = ({ data }: { data: DistinctPlayerTournaments | undefined }) => {

    if (!data) {

        return <Text>Keine Daten gefunden</Text>
    }

    useEffect(() => {
        console.log("---------------------------");

        console.log(data?.tournament_data.endDate);

    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <Image
                        source={require('@assets/images/cardImages/malong.jpg')}
                        resizeMode='cover'
                        style={styles.imagePreviewCircle} />

                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', flexShrink: 1 }}>
                            <Text style={styles.headerText}>{data?.tournament_data.name}</Text>
                        </View>
                        <Text style={styles.subheaderText}>{`${data?.tournament_data.locationName}`}</Text>
                    </View>
                </View>
                <SVG_Bookmark style={styles.bookmark} />
                <View style={styles.badges}>

                    <TurnierStateBadge state={data?.tournament_data.state ?? ''} />
                    <TurnierTypeBadge state={data?.tournament_data.type ?? ''} />
                </View>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.SubInformationBadges}>
                <View style={styles.SubInformationBadge}>
                    <View style={styles.ellipse}>
                        <SVG_Clock width={18} height={18} />
                    </View>
                    <Text style={styles.SubInformationBadgeText}>
                        {data?.tournament_data.startDate ? `${new Date(data?.tournament_data.startDate).toLocaleDateString('de-DE')}` : 'Datum nicht verfügbar'}
                    </Text>
                </View>
                <View style={[styles.SubInformationBadge, styles.badgeMarginLeft]}>
                    <View style={styles.ellipse}>
                        <SVG_Clock width={18} height={18} />
                    </View>
                    <Text style={styles.SubInformationBadgeText}>{`${data?.tournament_data.locationZIPCode} | ${data?.tournament_data.locationCity}`}</Text>
                </View>
                <View style={[styles.SubInformationBadge, styles.badgeMarginTop]}>
                    <View style={styles.ellipse}>
                        <FontAwesome name="map-marker" size={20} color={Colors.text.base} />
                    </View>

                    <Text style={styles.SubInformationBadgeText}>{data?.tournament_data.hostName}</Text>
                </View>
            </View>
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
        paddingBottom: 15
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
    }
})


export default TurnierCard