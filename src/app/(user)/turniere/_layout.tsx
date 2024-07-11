import React from 'react'
import { Stack } from 'expo-router'
import TurnierHeader from '@/components/Custom/TurnierHeader'

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name='tabs'
                options={{
                    headerShown: false,
                    headerShadowVisible: false,
                    headerTransparent: false
                }}
            />
            <Stack.Screen name='staffeln/[id]' options={{ presentation: 'modal', title: 'Staffeln', headerShown: false, headerTransparent: true, headerTintColor: '#E6E6EB' }} />
            <Stack.Screen name="[id]" options={{ presentation: 'modal', title: 'Staffeln', headerTransparent: true, headerTintColor: '#E6E6EB', headerShown: false }} />
        </Stack>
    )
}

export default Layout