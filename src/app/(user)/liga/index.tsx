import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import BaseScreen from '@/components/BaseScreen'

const LigaScreen = () => {
    return (
        <BaseScreen>
            <View style={styles.container}>

                <Text style={styles.text}>Liga Screen</Text>
            </View>
        </BaseScreen>
    )
}
const styles = StyleSheet.create({
    text: {
        color: 'white'
    },
    container: {
        marginTop: 50
    }
})
export default LigaScreen