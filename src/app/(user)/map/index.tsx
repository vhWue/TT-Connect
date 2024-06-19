import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const MapScreen = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [userRegion, setUserRegion] = useState({
        latitude: 49.7913,
        longitude: 9.9534,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [isMapReady, setIsMapReady] = useState(false);  // Neuer Zustand
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
            });
        })();
    }, []);


    const moveToUserRegion = () => {
        mapRef.current.animateToRegion(userRegion, 2000);
    };
    return (
        <View style={styles.container}>
            {!isMapReady && (
                <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
            )}
            <MapView
                region={userRegion}
                style={[styles.map, !isMapReady && styles.loading]}
                ref={mapRef}
                showsUserLocation
                showsPointsOfInterest={true}
                onMapReady={() => setIsMapReady(true)}  // Karte als geladen markieren

            >
                <Marker coordinate={{ latitude: 48.722594, longitude: 8.6986946 }} />
                <Marker coordinate={{ latitude: 49.30028, longitude: 9.14917 }} />
                <Marker coordinate={{ latitude: 49.3009736, longitude: 9.1452981 }} />
                <Marker coordinate={{ latitude: 49.5175259, longitude: 9.3269842 }} />
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


        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',

    },
    loading: {
        opacity: 0 // Setzen Sie die Deckkraft vorübergehend auf 0, bis die Karte geladen ist
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
