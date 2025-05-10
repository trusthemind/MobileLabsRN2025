"use client";
import { useState } from "react";
import { Button, Card, Input, Paragraph, XStack, YStack } from "tamagui";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, router } from "expo-router";
import { AppRoutes } from "constants/AppRoutes";
import { ImageBackground } from "react-native";
import background from "@/assets/images/background.png";
import { auth } from "@/shared/services/firebase";
import { useAuth } from "@/shared/hooks/authContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      await login(user);
    } catch (err: any) {
      setError(err.message || "Помилка входу");
    } finally {
      router.push(AppRoutes.PROFILE);
    }
  };

  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Card
        px="$6"
        py="$8"
        display="flex"
        justify="center"
        items="center"
        self="center"
        gap={24}
        width={380}
      >
        <Paragraph
          fontSize={24}
          height="$2"
          fontWeight="bold"
          style={{
            background: "linear-gradient(to right, #5B68DF, #E60C5B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome back
        </Paragraph>

        <YStack display="flex" items="center" gap={8} width="100%">
          <Input
            placeholder="Email"
            width="100%"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            placeholder="Пароль"
            width="100%"
            value={password}
            secureTextEntry
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError("");
            }}
          />
          {error ? <Paragraph color="red">{error}</Paragraph> : null}
        </YStack>

        <Button onPress={handleLogin} width="100%">
          Увійти
        </Button>

        <Link href={AppRoutes.REGISTRATION} style={{ color: "white" }}>
          Зареєструватися
        </Link>
      </Card>
    </ImageBackground>
  );
}
