import CustomHeader from "@/components/Custom/CustomHeader";


import { Stack } from "expo-router";




export default function HomeStack() {
    return <Stack>
        <Stack.Screen name="index" options={{
            header: () => <CustomHeader width="36" title="TT Connect" />,
            headerShadowVisible: false,
            headerTransparent: true,
        }} />
    </Stack>;
}