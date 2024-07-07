import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button, Pressable, Dimensions } from 'react-native';
import { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { useUpcomingTournamentsList } from '@/api/turniere';
import MapView from 'react-native-map-clustering';
import { Tables } from '@/types';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import SVG_Settings from '@assets/images/settings.svg';
import { useFilter } from '@/providers/MapFilterProvider';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const calculateDelta = (maxDistance: number, latitude: number) => {
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const latDelta = maxDistance / oneDegreeOfLatitudeInMeters;
    const lonDelta = maxDistance / (oneDegreeOfLatitudeInMeters * Math.cos(latitude * Math.PI / 180));
    return { latitudeDelta: latDelta * 2, longitudeDelta: lonDelta * 2 };
};



export type UserLocation = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const MapScreen = () => {
    const router = useRouter();
    const mapRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const filter = useFilter();
    const [activeFilterAmount, setActiveFilterAmount] = useState(0);
    const [isUserRegionLoaded, setIsUserRegionLoaded] = useState(false);
    const [isCurrentRegionInitiallyLoaded, setisCurrentRegionInitiallyLoaded] = useState(false)
    const [userRegion, setUserRegion] = useState<UserLocation>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
    });
    const [currentRegion, setCurrentRegion] = useState<UserLocation>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
    });
    const handleRegionChangeComplete = (region: any) => {
        setCurrentRegion({
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta
        })
    };
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
                latitudeDelta: 0.3,
                longitudeDelta: 0.09952762428750894,
            });
            setIsUserRegionLoaded(true); // Markiere userRegion als geladen
        })();
    }, []);

    useEffect(() => {
        let numTypes = filter.filterByTournamentType.length;
        let isFilterByDate = filter.filterByDateUpcoming ? 1 : 0;
        let filterByAgeGroup = filter.filterByAgeGroup ? 1 : 0;
        let sum = numTypes + isFilterByDate + filterByAgeGroup;
        setActiveFilterAmount(sum);

        //setCurrentRegion(filter.targetLocation)
    }, [filter]);

    useEffect(() => {

        if (isUserRegionLoaded) {

            setCurrentRegion(filter.targetLocation)



            /* console.log("----------------------------");
            console.log("Current Region", currentRegion);
            console.log("----------------------------");

            console.log(" Target Location", filter.targetLocation);
            console.log("----------------------------");
            console.log(" GeoCoords", filter.targetCoords);
            console.log("----------------------------"); */


            const newPosition = {
                latitude: filter.targetCoords.latitude,
                longitude: filter.targetCoords.longitude,
                latitudeDelta: filter.targetLocation.latitudeDelta,
                longitudeDelta: filter.targetLocation.longitudeDelta,
            }
            /* console.log("-------------------------------");
            console.log("New Position", newPosition); */

            mapRef.current.animateToRegion(newPosition, 2000);
            /*  console.log("Target Location geändert"); */

        }


    }, [filter.targetLocation, filter.targetCoords])


    useEffect(() => {
        if (isUserRegionLoaded) {
            setCurrentRegion(userRegion);
            setisCurrentRegionInitiallyLoaded(true)
        }
    }, [isUserRegionLoaded]);

    const moveToUserRegion = () => {

        mapRef.current.animateToRegion(userRegion, 2000);
    };

    const onMarkerSelected = (marker: Tables<'tournaments'>) => {
        console.log("Marker ID: ", marker.id);
        router.push(`/(user)/map/${marker.id}`);
    };

    const { data: tournaments, error, isLoading } = useUpcomingTournamentsList(filter);





    if (!isUserRegionLoaded && isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }


    return (

        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>

            {isUserRegionLoaded && isCurrentRegionInitiallyLoaded && (
                <MapView
                    initialRegion={userRegion}
                    region={currentRegion}
                    style={styles.map}
                    ref={mapRef}
                    showsUserLocation
                    showsPointsOfInterest={true}
                    showsCompass={false}
                    onRegionChangeComplete={handleRegionChangeComplete}
                >
                    {tournaments?.filter(t => t.locationLatitude !== null && t.locationLongitude !== null).map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.locationLatitude, longitude: marker.locationLongitude }}
                            onPress={() => onMarkerSelected(marker)}
                        />
                    ))}
                    <Circle
                        center={{ latitude: filter.targetCoords.latitude, longitude: filter.targetCoords.longitude }}
                        radius={filter.maxDistance * 1000}
                        strokeColor='rgba(78, 92, 214, 1.0)'
                        fillColor='rgba(98, 112, 234, 0.2)'
                    />
                    {/* <Circle
                    center={{ latitude: currentRegion.latitude, longitude: currentRegion.longitude }}
                    radius={filter.maxDistance * 1000}
                    strokeColor='rgba(51, 255, 147, 1)'
                    fillColor='rgba(51, 255, 147, 0.2)'
                /> */}
                </MapView>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontWeight: 'bold',
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
        right: 15,
    },
    userIcon: {
        position: 'absolute',
        bottom: 100,
        right: 20,
    },
    settingsIcon: {
        position: 'absolute',
        top: 55,
        right: 20,
    },
});

export default MapScreen;
