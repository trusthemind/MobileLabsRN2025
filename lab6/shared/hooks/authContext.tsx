import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signOut,
  User,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AuthContextType, UserData } from "../types/firebase";


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  login: async () => {},
  getStoredUser: async () => null,
  resetPassword: async () => {},
  fetchUserDetails: async () => null,
  deleteAccount: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const userDoc = await getDoc(doc(db, "users", u.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          const fullUser: UserData = {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            ...userData,
          };

          await AsyncStorage.setItem("user", JSON.stringify(fullUser));
          setUser(u);
        } catch (err) {
          console.error("Не вдалося завантажити дані користувача:", err);
        }
      } else {
        await AsyncStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  const fetchUserDetails = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  };

  const login = async (user: User) => {
    const simpleUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    await AsyncStorage.setItem("user", JSON.stringify(simpleUser));
    setUser(user);
  };

  const getStoredUser = async (): Promise<User | null> => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Пароль скинуто на вашу пошту");
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await deleteUser(currentUser);
        await AsyncStorage.removeItem("user");
        setUser(null);
        alert("Ваш акаунт було видалено");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        fetchUserDetails,
        loading,
        logout,
        login,
        getStoredUser,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
