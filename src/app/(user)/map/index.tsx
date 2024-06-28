import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button, Pressable } from 'react-native';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { useUpcomingTournamentsList } from '@/api/turniere';
import MapView from 'react-native-map-clustering';
import { Tables } from '@/types';
import { router, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import SVG_Settings from '@assets/images/settings.svg'
import { useFilter } from '@/providers/MapFilterProvider';

const MapScreen = () => {
    const router = useRouter()
    const mapRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const filter = useFilter()
    const { data: tournaments, error, isLoading } = useUpcomingTournamentsList(filter)
    const [userRegion, setUserRegion] = useState({
        latitude: 49.7913,
        longitude: 9.9534,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [activeFilterAmount, setActiveFilterAmount] = useState(0)

    useEffect(() => {
        let numTypes = filter.filterByTournamentType.length
        let isFilterByDate = filter.filterByDateUpcoming ? 1 : 0
        let sum = numTypes + isFilterByDate
        setActiveFilterAmount(sum)


    }, [filter])


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
            <View style={styles.settingsIcon}>
                <Pressable onPress={() => router.navigate('/(user)/map/filtermodal')}>
                    {({ pressed }) => (
                        <View>
                            <SVG_Settings style={{ opacity: pressed ? 0.5 : 1 }} />
                            <View style={styles.activeTypesWrapper}>
                                <Text style={styles.activeTypes}>{activeFilterAmount}</Text>
                            </View>
                        </View>
                    )}
                </Pressable>
            </View>
            <View style={styles.userIcon}>
                <Pressable onPress={() => moveToUserRegion()}>
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
    activeTypes: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    activeTypesWrapper: {
        width: 20,
        height: 20,
        backgroundColor: '#6270EA',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 50,
        top: -5,
        right: 15
    },
    userIcon: {

        position: 'absolute',
        bottom: 100,
        right: 20
    },
    settingsIcon: {

        position: 'absolute',
        top: 55,
        right: 20

    }
});

export default MapScreen;
