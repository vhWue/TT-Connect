import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import SVG_Trophy from '@assets/images/trophy.svg'


const FedRankBadge = ({ fedRank, grenze }: { fedRank: number | null, grenze: string }) => {
    let value = grenze + fedRank + ''
    if (fedRank === null) {
        value = ' offen'
    }
    return (
        <View style={[styles.container]}>
            <SVG_Trophy width={18} height={18} />
            <Text style={[styles.text]}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 120,
        minWidth: 80,
        height: 26,
        borderWidth: 2,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#131313'
    },
    text: {
        fontSize: 13,
        fontFamily: 'sfpro_bold',
        color: Colors.text.base
    },
})
export default FedRankBadge