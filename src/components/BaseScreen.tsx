import { View, Text, ImageBackground, SafeAreaView, StyleSheet } from 'react-native'
import React, { PropsWithChildren } from 'react'
import Colors from '@/constants/Colors'

const BaseScreen = ({ children }: PropsWithChildren) => {

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.bg_img} source={require('assets/images/Rectangle.png')}>
                <SafeAreaView>
                    {children}
                </SafeAreaView>
            </ImageBackground>
            <ImageBackground style={styles.ellipse}
                source={require('assets/images/Ellipse.png')}
            ></ImageBackground>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
        flex: 1
    },
    bg_img: {
        flex: 1,
        marginBottom: 180,
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