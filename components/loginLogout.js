import { auth } from "../utils/firebaseConfig";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";

const LoginLogout = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is signed in:", currentUser.uid);
        setUser(currentUser);
      } else {
        console.log("No user is signed in.");
        setUser(null);
      }
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);

  const loginAnonymously = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      console.log("User signed in anonymously", userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View>
      <Text className="text-3xl">News Agents</Text>

      {user ? <Text>User id {user.uid}</Text> : <Text>logged out</Text>}
      {user ? (
        <Button title="Log Out" onPress={logout} />
      ) : (
        <Button title="Log In Anonymously" onPress={loginAnonymously} />
      )}
    </View>
  );
};

export default LoginLogout;
