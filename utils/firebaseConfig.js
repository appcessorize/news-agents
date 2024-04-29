// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzVt83VZ-s1y2xxyLha1_YpOl86FIIcdQ",
  authDomain: "treeswap-wales.firebaseapp.com",
  projectId: "treeswap-wales",
  storageBucket: "treeswap-wales.appspot.com",
  messagingSenderId: "833651371642",
  appId: "1:833651371642:web:019f029921963cf7e295c3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
export { auth, db, storage, functions };
