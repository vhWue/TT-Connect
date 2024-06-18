import { View, Button, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar'


const SettingsScreen = () => {
    const { session } = useAuth();
    const [isLoading, setIsLoading] = useState(false)

    if (!session) {
        return <Redirect href={'/sign-in'} />
    }
    return (
        <View>
            {/* <Button
                onPress={async () => {
                    setIsLoading(true)
                    supabase.auth.signOut().then((data) => {
                        router.navigate('sign-in')
                    })
                    setIsLoading(false)


                }}
                title="Sign out"
            /> */}
            <Button onPress={async () => {
                setIsLoading(true)
                await supabase.auth.signOut()
                setIsLoading(false)
            }} title='Sign Out' />
            {isLoading ? <ActivityIndicator /> : null}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
};

export default SettingsScreen;