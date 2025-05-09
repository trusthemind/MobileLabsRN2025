import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyArd9ezmnEycvUWx4nlJb414vRAQ1v33ac',
  authDomain: 'to-do-native.firebaseapp.com',
  projectId: 'to-do-native',
  storageBucket: 'to-do-native.firebasestorage.app',
  messagingSenderId: '665115931247',
  appId: '1:665115931247:web:c0c8a07e96cb13d265939a',
  measurementId: 'G-7ZT7Q7PV6R',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
