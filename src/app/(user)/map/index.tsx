import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button, Pressable } from 'react-native';
import { Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTournamentsList } from '@/api/turniere';
import MapView from 'react-native-map-clustering';
import { Tables } from '@/types';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const MapScreen = () => {
    const { data: tournaments, error, isLoading } = useTournamentsList({ limit: 50 })
    const mapRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [userRegion, setUserRegion] = useState({
        latitude: 49.7913,
        longitude: 9.9534,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setUserRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            });
        })();


    }, []);


    const moveToUserRegion = () => {
        mapRef.current.animateToRegion(userRegion, 2000);
    };
    const onMarkerSelected = (marker: Tables<'tournaments'>) => {
        console.log("Marker ID: ", marker.id);
        router.push(`/(user)/map/${marker.id}`)
    }
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>

            <MapView
                initialRegion={userRegion}
                style={styles.map}
                ref={mapRef}
                showsUserLocation
                showsPointsOfInterest={true}
                showsCompass={false}
            >
                {
                    tournaments?.filter(tournaments => tournaments.locationLatitude !== null && tournaments.locationLongitude !== null).map((marker, index) => (
                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.locationLatitude, longitude: marker.locationLongitude }}
                            onPress={() => onMarkerSelected(marker)}
                        />

                    ))
                }

            </MapView>
            <View style={styles.icon}>
                <Pressable onPress={moveToUserRegion}>
                    {({ pressed }) => (
                        <FontAwesome
                            name="user"
                            size={25}
                            color='#E6E6EB'
                            style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable>
            </View>


        </Animated.View>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',

    },
    container: {
        flex: 1, // Ensure that the parent View fills the screen
        justifyContent: 'center', // Zentriert den ActivityIndicator
        alignItems: 'center',
    },
    activityIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    icon: {

        position: 'absolute',
        bottom: 100,
        right: 20

    }
});

export default MapScreen;
