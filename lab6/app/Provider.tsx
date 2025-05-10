import { useColorScheme } from "react-native";
import { TamaguiProvider, type TamaguiProviderProps } from "tamagui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { config } from "../tamagui.config";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, "config">) {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme!} {...rest}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastProvider swipeDirection="horizontal" duration={6000} native={[]}>
          {children}
          <ToastViewport top="$8" left={0} right={0} />
        </ToastProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
