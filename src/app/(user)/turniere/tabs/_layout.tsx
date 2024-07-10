import Colors from "@/constants/Colors";
import { ParamListBase, TabNavigationState, useNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { View, StyleSheet } from 'react-native';
import SVG_Bookmark from '@assets/images/material-symbols_bookmark-outline.svg';
import { BlurView } from 'expo-blur';
import TurnierHeader from '@/components/Custom/TurnierHeader';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap
} from '@react-navigation/material-top-tabs'
import { Bookmarked, TurnierIcon } from '@/constants/Icons';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<MaterialTopTabNavigationOptions, typeof Navigator, TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap>(Navigator)

export default function TurnierStack() {



    return (
        <SafeAreaView style={styles.container}>

            <MaterialTopTabs
                screenOptions={{
                    tabBarActiveTintColor: Colors.nav.active,
                    tabBarInactiveTintColor: Colors.text.lightgray,
                    tabBarLabelStyle: { fontFamily: 'sfpro_bold', fontSize: 14 },
                    tabBarIndicatorStyle: { backgroundColor: Colors.nav.active, height: 3 },
                    tabBarStyle: { backgroundColor: 'transparent' }

                }}>
                <MaterialTopTabs.Screen name="overview" options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <AntDesign name="calendar" size={24} color={color} />

                }} />
                <MaterialTopTabs.Screen name="personal" options={{
                    title: 'Angemeldet',
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <>
                        <View style={{ position: 'absolute', left: 5, bottom: 10 }}><TurnierIcon color={color} size={22} /></View>
                        <FontAwesome name="user" size={24} color={color} />
                    </>,


                }} />
                <MaterialTopTabs.Screen name="bookmarked" options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <Bookmarked color={color} size={30} />,
                }} />
            </MaterialTopTabs>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,

    }
});
