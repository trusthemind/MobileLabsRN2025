import { AppRoutes } from "@/constants/AppRoutes";
import { Link, Stack } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";
import { View, Text, Card } from "tamagui";
import background from "assets/images/background.png";

export default function NotFoundScreen() {
  return (
    <>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Stack.Screen
          options={{
            title: "Oops!",
            headerTitleAlign: "center",
            headerShown: false,
          }}
        />
        <View m={10}>
          <Card
            self={"center"}
            width={300}
            height={300}
            display="flex"
            justify={"center"}
            items={"center"}
            gap={10}
          >
            <Text>This screen doesn't exist.</Text>
            <Link href={AppRoutes.LOGIN} selectionColor={"$blue10"}>
              <Text color={"$blue10"}>Go back</Text>
            </Link>
          </Card>
        </View>
      </ImageBackground>
    </>
  );
}
