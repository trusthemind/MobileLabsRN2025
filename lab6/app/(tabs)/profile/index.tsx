import { Text, View, Button, YStack, Spinner, Card } from "tamagui";
import { useRouter } from "expo-router";
import { AppRoutes } from "constants/AppRoutes";
import { useAuth } from "@/shared/hooks/authContext";
import { useEffect, useState } from "react";
import { UserDetails } from "@/shared/types/firebase";

export default function ProfileScreen() {
  const {
    user,
    logout,
    loading,
    resetPassword,
    deleteAccount,
    fetchUserDetails,
  } = useAuth();
  const router = useRouter();


  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (user?.uid) fetchUserDetails(user.uid).then(setUserDetails);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace(AppRoutes.LOGIN);
  };

  const handleResetPassword = async () => {
    if (user?.email) {
      await resetPassword(user.email);
    }
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    router.replace(AppRoutes.LOGIN);
  };

  if (loading) {
    return (
      <View flex={1} justify="center" items="center">
        <Spinner size="large" />
      </View>
    );
  }

  if (!user) {
    router.replace(AppRoutes.LOGIN);
    return null;
  }

  return (
    <View
      flex={1}
      justify="center"
      items="center"
      px="$4"
      background={"$blue4"}
    >
      <Card p={"$4"} width={360}>
        <YStack gap="$4" items="center">
          <Text fontSize={24} fontWeight="bold">
            Профіль
          </Text>
          <Text fontSize={18}>Email: {user.email}</Text>
          {user.displayName && (
            <Text fontSize={18}>Name: {user.displayName}</Text>
          )}
          {user.photoURL && (
            <Text fontSize={18}>Profile Picture URL: {user.photoURL}</Text>
          )}
          {userDetails && (
            <>
              <Text fontSize={18}>Дата народження: {userDetails.birthday}</Text>
              <Text fontSize={18}>Група крові: {userDetails.bloodType}</Text>
              <Text fontSize={18}>Місто: {userDetails.city}</Text>
              <Text fontSize={18}>Зріст: {userDetails.height} см</Text>
              <Text fontSize={18}>Вага: {userDetails.weight} кг</Text>
            </>
          )}
          <Button
            onPress={handleResetPassword}
            background="$blue4"
            width={"100%"}
            color="white"
          >
            Скинути пароль
          </Button>

          <Button
            onPress={handleLogout}
            width={"100%"}
            background="#E60C5B"
            color="white"
          >
            Вийти
          </Button>

          <Button
            onPress={handleDeleteAccount}
            background="$red8"
            width={"100%"}
            color="white"
          >
            Видалити акаунт
          </Button>
        </YStack>
      </Card>
    </View>
  );
}
