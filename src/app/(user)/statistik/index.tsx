import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import BaseScreen from '@/components/BaseScreen'

const StatistikScreen = () => {
    return (
        <BaseScreen>
            <View style={styles.container}>

                <Text style={styles.text}>Statistik Screen</Text>
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
export default StatistikScreen