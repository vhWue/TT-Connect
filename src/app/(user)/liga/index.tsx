import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import BaseScreen from '@/components/BaseScreen';
import { useRouter } from 'expo-router';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { FadeIn } from 'react-native-reanimated';

const LigaScreen = () => {
    const router = useRouter();

    const handlePanGestureStateChange = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END && nativeEvent.translationX < -50) { // Minimum swipe distance to trigger the navigation
            router.push('/(user)/turniere');
        }
    };

    return (
        <BaseScreen entering={FadeIn} ellipse={true} marginBottom={0}>
            <PanGestureHandler onHandlerStateChange={handlePanGestureStateChange}>
                <View style={styles.container}>
                    <Text style={styles.text}>Liga Screen</Text>
                </View>
            </PanGestureHandler>
        </BaseScreen>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    },
    container: {
        marginTop: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LigaScreen;
