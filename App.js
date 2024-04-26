import { auth } from "./utils/firebaseConfig";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";

//firestore
import { db } from "./utils/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [textFromUser, setTextFromUser] = useState(null);
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

  const addDataToFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: textFromUser,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-3xl">News Agents</Text>

      {user ? <Text>User id {user.uid}</Text> : <Text>logged out</Text>}
      {user ? (
        <Button title="Log Out" onPress={logout} />
      ) : (
        <Button title="Log In Anonymously" onPress={loginAnonymously} />
      )}
      <TextInput
        placeholder="Enter something..."
        value={textFromUser}
        onChangeText={setTextFromUser}
      />
      {textFromUser && (
        <>
          <Button title="add data to firestore" onPress={addDataToFirestore} />
        </>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
