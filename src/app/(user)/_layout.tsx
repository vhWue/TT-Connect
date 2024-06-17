import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import Svg, { Circle, Rect } from 'react-native-svg';
import { HomeIcon, LigenIcon, MapIcon, TurnierIcon } from '@/constants/Icons';
import Colors from '@/constants/Colors';
import { AnalyticsIcon } from '../../constants/Icons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native'
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.nav.active, // Farbe für aktive Tabs
                tabBarInactiveTintColor: Colors.nav.inactive, // Farbe für inaktive Tabs
                tabBarStyle: {
                    position: 'absolute',
                    paddingTop: 20,
                    borderTopWidth: 0
                },

                tabBarBackground: () => (
                    <BlurView
                        intensity={15}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            overflow: 'hidden',
                        }}
                    />
                ),
            }}>
            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen
                name="liga"
                options={{
                    headerShown: false,
                    title: 'Ligen',
                    tabBarIcon: ({ color }) => <LigenIcon size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="turniere"
                options={{
                    headerShown: false,
                    title: 'Turniere',
                    tabBarIcon: ({ color }) => <TurnierIcon size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }) => <HomeIcon size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="statistik"
                options={{
                    headerShown: false,
                    title: 'Statistik',
                    tabBarIcon: ({ color }) => <AnalyticsIcon size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    headerShown: false,
                    title: 'Map',
                    tabBarIcon: ({ color }) => <MapIcon size={25} color={color} />,
                }}
            />
        </Tabs>
    );
}



