import React from 'react';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import SVGBat from '@assets/images/Bat.svg'
import SVGBat_red from '@assets/images/bat_red.svg'
import Colors from '@/constants/Colors';

const TurnierHeader = ({ title, titleWidth }: { title: string, titleWidth: number }) => {



    return (
        <View style={styles.header}>

            <SVGBat style={styles.bat} width={25} height={25} />

            <MaskedView
                style={{ width: titleWidth + '%' }}
                maskElement={
                    <View style={{
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                        <Text style={[styles.title, { backgroundColor: 'transparent' }]}>{title}</Text>
                    </View>
                }
            >
                <LinearGradient
                    colors={['#E6E6EB', '#FF2323', '#FF2323']}
                    start={{ x: 0.3, y: 0 }}
                    end={{ x: 0.9, y: 0 }}  // Endpunkt näher zum rechten Rand ziehen
                    style={{ flex: 1 }}
                />

            </MaskedView>
            <SVGBat_red style={styles.bat_r} width={25} height={25} />


        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white', // Farbe des Textes muss transparent sein, damit der Gradient durchscheint
        paddingTop: 60,
        fontFamily: "Staatliches",
        letterSpacing: 2
    },
    bat: {
        top: 20,

    },
    bat_r: {
        top: 20,
    },
});

export default TurnierHeader;
