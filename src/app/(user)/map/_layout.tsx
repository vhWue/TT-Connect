import CustomHeader from "@/components/Custom/CustomHeader";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Link, Stack, useRouter } from "expo-router";
import { Pressable, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import FilterModalHeader from "@/components/Custom/FilterModalHeader";
import FilterProvider, { useFilter } from "@/providers/MapFilterProvider";

export default function MapStack() {
    const route = useRoute()
    const router = useRouter()



    return <FilterProvider>
        <Stack>
            <Stack.Screen name="index" options={{
                header: () => <CustomHeader router_name={route.name} width="17" title="Map" />,
                headerShadowVisible: false,
                headerTransparent: true,
                headerShown: false
            }} />
            <Stack.Screen name="filtermodal" options={{
                presentation: 'transparentModal',
                animation: 'fade',
                headerTitle: (props) => <FilterModalHeader />,
                headerTransparent: true,
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => router.back()}>
                        <AntDesign name="closecircleo" style={{ paddingRight: 8 }} size={30} color={Colors.text.base} />
                    </TouchableOpacity>
                )
            }}
            />
        </Stack>
    </FilterProvider>;
}