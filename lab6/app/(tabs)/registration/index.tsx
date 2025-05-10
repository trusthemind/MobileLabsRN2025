import { useState } from "react";
import { Input, Button, YStack, Text, Card, Paragraph } from "tamagui";
import { useRouter } from "expo-router";
import { ImageBackground } from "react-native";
import background from "@/assets/images/background.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/shared/services/firebase";
import { AppRoutes } from "constants/AppRoutes";

export default function RegisterScreen() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [city, setCity] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleNextStep = () => {
    if (password !== repeatPassword) {
      setError("Паролі не співпадають");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleRegister = async () => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email,
        weight: Number(weight),
        height: Number(height),
        city,
        bloodType,
        birthday,
      });
      router.replace(AppRoutes.PROFILE);
    } catch (err: any) {
      setError(err.message || "Помилка реєстрації");
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
          Створіть акаунт
        </Paragraph>

        <YStack gap="$4" width="100%">
          {step === 1 ? (
            <>
              <Input
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError("");
                }}
              />
              <Input
                placeholder="Пароль"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError("");
                }}
              />
              <Input
                placeholder="Повторіть пароль"
                secureTextEntry
                value={repeatPassword}
                onChangeText={(text) => {
                  setRepeatPassword(text);
                  if (error) setError("");
                }}
              />
              {error ? <Text color="red">{error}</Text> : null}
              <Button onPress={handleNextStep}>Далі</Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Вага (кг)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <Input
                placeholder="Зріст (см)"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <Input placeholder="Місто" value={city} onChangeText={setCity} />
              <Input
                placeholder="Група крові"
                value={bloodType}
                onChangeText={setBloodType}
              />
              <Input
                placeholder="Дата народження (YYYY-MM-DD)"
                value={birthday}
                onChangeText={setBirthday}
              />
              {error ? <Text color="red">{error}</Text> : null}
              <Button onPress={handleRegister}>Завершити реєстрацію</Button>
            </>
          )}
        </YStack>

        <Text
          style={{ color: "white", marginTop: 8 }}
          onPress={() => setStep(1)}
        >
          Назад
        </Text>
      </Card>
    </ImageBackground>
  );
}
