import { useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { Audio } from "expo-av";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../utils/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

export default function AudioRecorder({ user }) {
  const [uploadingAudio, setUploadingAudio] = useState(false);
  console.log("user", user.uid);
  const userId = user.uid;
  console.log("userid", userId);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [audioUri, setAudioUri] = useState(null); // Initialize as null
  const [audioUrl, setAudioUrl] = useState(null);
  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  async function fetchAudioUrl() {
    try {
      const audioRecordsQuery = query(
        collection(db, "audioRecords"),
        where("userId", "==", userId)
      );
      const audioRecordsSnapshot = await getDocs(audioRecordsQuery);

      // Check if there's any audio record associated with the user
      if (!audioRecordsSnapshot.empty) {
        // Assuming there's only one audio record per user, use the first one
        const audioRecord = audioRecordsSnapshot.docs[0].data();
        setAudioUrl(audioRecord.audioUrl);
      } else {
        console.log("No audio record found for the user");
      }
    } catch (error) {
      console.error("Error fetching audio URL:", error);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    setAudioUri(uri); // Save the URI of the recording
    setRecording(undefined);
  }

  async function playSound() {
    console.log("Playing Sound..");
    if (audioUri) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri } // Use the uri directly
      );
      await sound.playAsync();
    } else {
      console.log("No audio to play.");
    }
  }
  async function playSoundFromFirebaseUrl() {
    console.log("Playing Sound..");
    if (audioUrl) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl } // Use the uri directly
      );
      await sound.playAsync();
    } else {
      console.log("No audio to play.");
    }
  }
  async function uploadAudio(uri) {
    setUploadingAudio(true);
    const clientTimestamp = new Date().toISOString().replace(/:/g, "-"); // Client-side timestamp
    const audioPath = `audio/${userId}/${clientTimestamp}.wav`;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageReference = storageRef(storage, audioPath);
      const uploadResult = await uploadBytes(storageReference, blob);
      const audioUrl = await getDownloadURL(uploadResult.ref);
      console.log("Audio uploaded successfully!");

      // Create a document in Firestore
      await addDoc(collection(db, "audioRecords"), {
        audioUrl: audioUrl,
        createdAt: serverTimestamp(),
        userId: userId,
      });

      setUploadingAudio(false);
      console.log("Firestore record created successfully!");
    } catch (err) {
      setUploadingAudio(false);
      console.error("Error in uploading audio or updating Firestore:", err);
    }
  }

  return (
    <View className="p-4 bg-white">
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {audioUrl && <Text>Audio URL: {audioUrl}</Text>}
      {audioUri && <Button title="Fetch audio URL" onPress={fetchAudioUrl} />}
      {audioUrl && (
        <Button
          title="Play Sound from firebase"
          onPress={playSoundFromFirebaseUrl}
        />
      )}
      {audioUri && <Button title="Play Sound" onPress={playSound} />}
      {audioUri && (
        <Button title="Upload audio" onPress={() => uploadAudio(audioUri)} />
      )}
      {uploadingAudio && <Text>Uploading audio...</Text>}
    </View>
  );
}
