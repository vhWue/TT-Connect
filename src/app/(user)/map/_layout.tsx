import CustomHeader from "@/components/Custom/CustomHeader";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Link, Stack } from "expo-router";
import { Pressable } from 'react-native';



export default function MapStack() {
    const router = useRoute()
    return <Stack>
        <Stack.Screen name="index" options={{
            header: () => <CustomHeader router_name={router.name} width="17" title="Map" />,
            headerShadowVisible: false,
            headerTransparent: true,
        }} />
    </Stack>;
}