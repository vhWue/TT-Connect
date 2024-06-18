
import CustomHeader from "@/components/Custom/CustomHeader";
import { useRoute } from "@react-navigation/native";
import { Stack } from "expo-router";




export default function LigaStack() {
    const router = useRoute()
    return <Stack>
        <Stack.Screen name="index" options={{
            header: () => <CustomHeader router_name={router.name} width="20" title="Ligen" />,
            headerShadowVisible: false,
            headerTransparent: true,
        }} />
    </Stack>;
}