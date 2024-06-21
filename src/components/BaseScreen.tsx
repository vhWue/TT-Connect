import { View, Text, ImageBackground, SafeAreaView, StyleSheet } from 'react-native'
import React, { PropsWithChildren, ReactElement } from 'react'
import Colors from '@/constants/Colors'
import Animated from 'react-native-reanimated'

type BaseScreenProps = {
    entering?: any,
    exiting?: any,
    ellipse?: boolean
} & PropsWithChildren

const BaseScreen = ({ children, exiting, entering, ellipse = true }: BaseScreenProps) => {

    return (
        <Animated.View entering={entering} exiting={exiting} style={styles.container}>
            <ImageBackground style={styles.bg_img} source={require('assets/images/Rectangle.png')}>
            </ImageBackground>
            <View style={{ flex: 1, marginBottom: 75, }} >
                {children}
            </View>
            {ellipse && (
                <ImageBackground style={styles.ellipse}
                    source={require('assets/images/Ellipse.png')}
                ></ImageBackground>
            )}

        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
        flex: 1,
    },
    bg_img: {
        bottom: 40,
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
    ellipse: {
        width: 300,
        height: 300,
        position: 'absolute',
        bottom: 10,
        left: -100,
    },

})

export default BaseScreen