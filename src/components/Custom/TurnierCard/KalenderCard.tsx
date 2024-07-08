import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import Colors from '@/constants/Colors'

import SVG_Clock from '@assets/images/clock.svg'
import TurnierStateBadge from './TurnierStateBadge'
import { Tables } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import TurnierTypeBadge from './TurnierTypeBadge'

const KalenderCard = ({ data }: { data: Tables<'tournaments'> | undefined }) => {

    if (!data) {

        return <Text>Keine Daten gefunden</Text>
    }
    function insertLineBreakAtNearestWord(inputString: string | null, breakPosition: number): string {
        if (inputString == null) {
            return ''
        }
        if (breakPosition < 0 || breakPosition >= inputString.length) {
            return inputString;
        }

        // Finde den nächsten Leerzeichen nach der Break-Position
        let spaceIndex = inputString.lastIndexOf(' ', breakPosition);

        // Wenn kein Leerzeichen vor der Break-Position gefunden wurde, suche das nächste Leerzeichen danach
        if (spaceIndex === -1) {
            spaceIndex = inputString.indexOf(' ', breakPosition);
        }

        // Wenn kein Leerzeichen gefunden wurde, gebe den ursprünglichen String zurück
        if (spaceIndex === -1) {
            return inputString;
        }

        return inputString.slice(0, spaceIndex) + '\n' + inputString.slice(spaceIndex + 1);
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <Image
                        source={require('@assets/images/cardImages/malong.jpg')}
                        resizeMode='cover'
                        style={styles.imagePreviewCircle} />

                    <View >
                        <View style={styles.headerWrapper}>
                            <Text style={styles.headerText}>{insertLineBreakAtNearestWord(data?.name, 30)}</Text>
                        </View>
                        <View style={styles.subHeaderWrapper}>
                            <Text style={styles.subheaderText}>{`${insertLineBreakAtNearestWord(data.locationName, 40)}`}</Text>
                        </View>

                    </View>
                </View>

                <View style={styles.badges}>

                    <TurnierStateBadge state={data?.state ?? ''} />
                    <TurnierTypeBadge state={data?.type ?? ''} />
                </View>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.SubInformationBadges}>
                <View style={styles.SubInformationBadge}>
                    <View style={styles.ellipse}>
                        <SVG_Clock width={18} height={18} />
                    </View>
                    <Text style={styles.SubInformationBadgeText}>
                        {data?.startDate ? `${new Date(data?.startDate).toLocaleDateString('de-DE')}` : 'Datum nicht verfügbar'}
                    </Text>
                </View>
                <View style={[styles.SubInformationBadge, styles.badgeMarginLeft]}>
                    <View style={styles.ellipse}>
                        <SVG_Clock width={18} height={18} />
                    </View>
                    <Text style={styles.SubInformationBadgeText}>{`${data?.locationZIPCode} | ${data?.locationCity}`}</Text>
                </View>
                <View style={[styles.SubInformationBadge, styles.badgeMarginTop]}>
                    <View style={styles.ellipse}>
                        <FontAwesome name="map-marker" size={20} color={Colors.text.base} />
                    </View>

                    <Text style={styles.SubInformationBadgeText}>{data?.hostName}</Text>
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
    headerWrapper: {
        flex: 1
    },
    subHeaderWrapper: {
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
        flexShrink: 1,
        width: '100%'
    },
    headerText: {
        color: Colors.text.base,
        fontFamily: 'sfpro_bold',
        fontSize: 16,
        flexShrink: 1,
        flex: 1,
    },
    subheaderText: {
        color: Colors.text.lightgray,
        fontFamily: 'sfpro_bold',
        fontSize: 14,
        paddingTop: 5,
        flexShrink: 1,

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


export default KalenderCard