// utileria/firebase.js
import { initializeApp } from "firebase/app";
import { Platform } from "react-native";

// Auth web
import { getAuth, browserLocalPersistence } from "firebase/auth";
// Auth nativo
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firestore & Functions
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// 1) Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2y5qlqFHGt4eA-0390eeX5wEMyMzvBrY",
  authDomain: "docnow-5768f.firebaseapp.com",
  projectId: "docnow-5768f",
  storageBucket: "docnow-5768f.firebasestorage.app",
  messagingSenderId: "440063247099",
  appId: "1:440063247099:web:67155c42cf4ea1f200265e",
  measurementId: "G-6JK48GJ20B",
};
const app = initializeApp(firebaseConfig);

// 1) Auth
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// 2) Firestore
const db = getFirestore(app);

// 3) Functions
const functions = getFunctions(app);

export { app, auth, db, functions };
