import "../tamagui-web.css";

import { useEffect } from "react";
import { ImageBackground, StatusBar, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Provider } from "./Provider";
import { TamaguiProvider, useTheme } from "tamagui";
import { AuthProvider } from "@/shared/hooks/authContext";
import { ToastProvider } from "@tamagui/toast";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <Provider>
      <RootLayoutNav />
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <NavigationContainer
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <ToastProvider>
          <StatusBar
            barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          />
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </ToastProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}
