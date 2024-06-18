import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location'
import darkThemeMapStyle from '@/constants/customMap'

const MapScreen = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [userRegion, setUserRegion] = useState({
        latitude: 49.7913,
        longitude: 9.9534,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })
    const mapRef = useRef(null);
    const isFocused = useIsFocused();

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
            })
        })();
    }, []);

    useEffect(() => {
        if (isFocused && mapRef.current) {
            mapRef.current.animateToRegion(userRegion, 350); // Animate to the region when focused
        }
    }, [isFocused]);




    return (
        <View style={styles.container}>
            <MapView
                region={userRegion}

                style={styles.map}
                ref={mapRef}
                showsUserLocation
                showsPointsOfInterest={true}
            >
                <Marker coordinate={{
                    latitude: 48.722594,
                    longitude: 8.6986946
                }} />
                <Marker coordinate={{
                    latitude: 49.30028,
                    longitude: 9.14917
                }} />
                <Marker coordinate={{
                    latitude: 49.3009736,
                    longitude: 9.1452981
                }} />
                <Marker coordinate={{
                    latitude: 49.5175259,
                    longitude: 9.3269842
                }} />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1 // Ensure that the parent View fills the screen
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default MapScreen;
