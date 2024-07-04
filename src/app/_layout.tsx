import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import AuthProvider from '@/providers/AuthProvider';
import QueryProvider from '@/providers/QueryProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    SFProDisplay: require('../../assets/fonts/SF-Pro-Display-Regular.ttf'),
    sfpro_bold: require('../../assets/fonts/sfProDisplay/SFPRODISPLAYBOLD.ttf'),
    sfpro_medium: require('../../assets/fonts/sfProDisplay/SFPRODISPLAYMEDIUM.ttf'),
    Staatliches: require('../../assets/fonts/Staatliches.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <QueryProvider>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(user)" options={{ headerShown: false, }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="settings_modal" options={{ presentation: 'modal', title: 'Settings', headerTransparent: true, headerTintColor: '#E6E6EB' }} />
            <Stack.Screen name="turnier_modal/[id]" options={{ presentation: 'modal', title: 'Staffeln', headerTransparent: true, headerTintColor: '#E6E6EB' }} />
          </Stack>
        </GestureHandlerRootView>
      </QueryProvider>
    </AuthProvider>
  );
}
