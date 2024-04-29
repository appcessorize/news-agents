import { auth } from "../utils/firebaseConfig";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";

//firestore

import AudioRecorder from "../components/audioRecorder";
import CameraUploader from "../components/cameraUploader";
import TextRecorder from "../components/textRecorder";
import MedialList from "../components/mediaList";
import LoginLogout from "../components/loginLogout";
import CallCloudFunc from "../components/callCloudFunc";

const HomeScreen = ({ navigation }) => {
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
  return (
    <View className="flex-1 items-center justify-around bg-red-500">
      <Button
        title="Go to press release"
        onPress={() => navigation.navigate("PressRelease")}
      />
      <Text className="text-3xl">News Agents</Text>
      <Button
        title="Open Faq"
        on
        onPress={() => navigation.navigate("FAQScreen")}
      />
      <LoginLogout />

      {user && (
        <View>
          {/* <MedialList user={user} /> */}
          {/* <AudioRecorder user={user} /> */}
          <CallCloudFunc />
          {/* <TextRecorder user={user} /> */}
          {/* <CameraUploader user={user} /> */}
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

export default HomeScreen;
