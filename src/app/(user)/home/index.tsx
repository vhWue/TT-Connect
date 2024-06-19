import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import BaseScreen from '@/components/BaseScreen';
import { useTournamentsList } from '@/api/turniere';


const HomeScreen = () => {

    const { data: tournaments, error, isLoading } = useTournamentsList({ limit: 1 })
    console.log("------------------------------------------------");

    console.log("Turnierdaten", tournaments);

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
        marginTop: 50
    }
})
export default HomeScreen