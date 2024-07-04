import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const checkStateContainer = (state: string) => {
    switch (state) {
        case 'cancelled': return { backgroundColor: '#E25F5F', borderColor: '#732828', }
        case 'upcoming': return { backgroundColor: '#33FF93', borderColor: '#009244', }
        case 'completed': return { backgroundColor: '#5188CA', borderColor: '#294970', }
        default: return;
    }
}
const checkTextContainer = (state: string) => {
    switch (state) {
        case 'cancelled': return { color: '#732828', }
        case 'upcoming': return { color: '#009244', }
        case 'completed': return { color: '#294970', }
        default: return;
    }
}

const TurnierStateBadge = ({ state }: { state: string }) => {
    return (
        <View style={[styles.container, checkStateContainer(state)]}>
            <Text style={[styles.text, checkTextContainer(state)]}>{state}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minWidth: 80,
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
export default TurnierStateBadge