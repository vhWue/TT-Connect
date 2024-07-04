import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const checkStateContainer = (state: string) => {
    switch (state) {
        case 'open':
            return { backgroundColor: '#FFD700', borderColor: '#B8860B', }
        case 'qualification':
            return { backgroundColor: '#FF69B4', borderColor: '#C71585', }
        case 'circuit':
            return { backgroundColor: '#1E90FF', borderColor: '#00008B', }
        default:
            return { backgroundColor: '#FFFFFF', borderColor: '#000000', }
    }
}
const checkTextContainer = (state: string) => {
    switch (state) {
        case 'open':
            return { backgroundColor: '#FFD700', borderColor: '#B8860B', }
        case 'qualification':
            return { backgroundColor: '#FF69B4', borderColor: '#C71585', }
        case 'circuit':
            return { backgroundColor: '#1E90FF', borderColor: '#00008B', }
        default:
            return { backgroundColor: '#FFFFFF', borderColor: '#000000', }
    }
}

const TurnierTypeBadge = ({ state }: { state: string }) => {
    return (
        <View style={[styles.container, checkStateContainer(state)]}>
            <Text style={[styles.text, checkTextContainer(state)]}>{state}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minWidth: 85,
        height: 26,
        borderWidth: 2,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerState: {
        backgroundColor: '#E25F5F',
        borderColor: '#8B3131',
    },
    text: {
        fontSize: 13,
        fontFamily: 'sfpro_bold',
    },
    textState: {
        color: '#8B3131'
    }
})
export default TurnierTypeBadge