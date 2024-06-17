
import CustomHeader from "@/components/Custom/CustomHeader";
import { Stack } from "expo-router";




export default function LigaStack() {
    return <Stack>
        <Stack.Screen name="index" options={{
            header: () => <CustomHeader width="23" title="Ligen" />,
            headerShadowVisible: false,
            headerTransparent: true,
        }} />
    </Stack>;
}