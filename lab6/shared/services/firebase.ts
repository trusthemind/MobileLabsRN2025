import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaCh6HLticRqCRdSeDC6wY4Vop5zj2CXw",
  authDomain: "sol-app-f2424f.firebaseapp.com",
  projectId: "sol-app-f2424f",
  storageBucket: "sol-app-f2424f.firebasestorage.app",
  messagingSenderId: "900449019120",
  appId: "1:900449019120:web:89bfda74bedeff1c784e35",
  measurementId: "G-MCBKQHLYBM",
};
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
