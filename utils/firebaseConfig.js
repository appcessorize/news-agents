// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYq5ydrpUDRKvTZHtTfbLlVbh9wZuO99o",
  authDomain: "photo-upload-dc1ce.firebaseapp.com",
  projectId: "photo-upload-dc1ce",
  storageBucket: "photo-upload-dc1ce.appspot.com",
  messagingSenderId: "574907793736",
  appId: "1:574907793736:web:fd22de14b849fcdf51b37d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
