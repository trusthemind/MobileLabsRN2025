import { Link, Tabs } from "expo-router";
import { Button, useTheme } from "tamagui";
import { Atom, AudioWaveform, Home, UserCircle2 } from "@tamagui/lucide-icons";
import { useAuth } from "@/shared/hooks/authContext";

export default function TabLayout() {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.background.val,
        },
        headerTintColor: theme.color.val,
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <UserCircle2 color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="login/index"
        options={{
          title: "Login",
          tabBarIcon: ({ color }) => <Atom color={color as any} />,
          // headerRight: () => (
          //   <Button mr="$4" bg="$red10" color="$red2">
          //     Hello!
          //   </Button>
          // ),
        }}
      />
      <Tabs.Screen
        name="registration/index"
        options={{
          title: "Registration",
          tabBarIcon: ({ color }) => <AudioWaveform color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color as any} />,
          // headerRight: () => (
          //   <Button mr="$4" bg="$red10" color="$red2">
          //     Hello!
          //   </Button>
          // ),
        }}
      />
    </Tabs>
  );
}
