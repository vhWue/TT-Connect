import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

import BaseScreen from '@/components/BaseScreen';


const HomeScreen = () => {
    return (
        <BaseScreen>
            <View style={styles.container}>


                <Text style={styles.text}>HomeScreen</Text>

            </View>
        </BaseScreen>
    )
}
const styles = StyleSheet.create({
    text: {
        color: 'white'
    },
    container: {
        marginTop: 50,

    }
})
export default HomeScreen