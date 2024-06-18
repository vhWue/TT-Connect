import CustomHeader from "@/components/Custom/CustomHeader";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from 'react-native';



export default function StatistikStack() {
    return <Stack>
        <Stack.Screen name="index" options={{
            header: () => <CustomHeader width="30" title="Statistik" />,
            headerShadowVisible: false,
            headerTransparent: true,
        }} />
    </Stack>;
}