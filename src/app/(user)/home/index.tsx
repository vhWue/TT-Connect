import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import BaseScreen from '@/components/BaseScreen';
import { useRouter } from 'expo-router';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const router = useRouter();
    const handlePanGestureStateChange = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            if (nativeEvent.translationX < -50) { // Minimum swipe distance to trigger the navigation to the left
                router.push('/(user)/statistik');
            } else if (nativeEvent.translationX > 50) { // Minimum swipe distance to trigger the navigation to the right
                router.push('/(user)/turniere');
            }
        }
    };

    return (
        <BaseScreen entering={FadeIn} ellipse={true} marginBottom={0}>
            <PanGestureHandler onHandlerStateChange={handlePanGestureStateChange}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.text}>HomeScreen</Text>
                </SafeAreaView>
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

export default HomeScreen;
