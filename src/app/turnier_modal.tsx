

import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Animated, { Easing, FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import BaseScreen from '@/components/BaseScreen';

const TurnierDetailModalScreen = () => {
    return (
        <BaseScreen>
            <Stack.Screen options={{ headerTransparent: true }} />

            <Text style={styles.text}>Turnier Detail ID</Text>

        </BaseScreen>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "white"
    }

})

export default TurnierDetailModalScreen