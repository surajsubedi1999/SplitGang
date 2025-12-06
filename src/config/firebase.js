// Firebase Configuration - Pawan Phuyal
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfVG7537k1e1e2k1xyfKwxqDlAZn6dRno",
  authDomain: "splitgang-38b09.firebaseapp.com",
  projectId: "splitgang-38b09",
  storageBucket: "splitgang-38b09.firebasestorage.app",
  messagingSenderId: "355501571388",
  appId: "1:355501571388:web:65b70303e7f4e5201bb239",
  measurementId: "G-2686BFFPRC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence (keeps user logged in)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
