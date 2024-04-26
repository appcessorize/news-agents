import React, { useState, useRef } from "react";
import { View, StyleSheet, Button, Text, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { db } from "../utils/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Camera, CameraType } from "expo-camera";
const CameraUploader = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

  const [imageUrlFromFirestore, setImageUrlFromFirestore] = useState(null);
  const [videoUrlFromFirestore, setVideoUrlFromFirestore] = useState(null);
  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      setVideoUri(video.uri);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setSelectedVideo(videoUri);
    }
  };
  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission denied",
        "You need to grant permission to access the media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("No image selected", "Please select an image first.");
      return;
    }

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storage = getStorage();
      const imageName = `images/${user.uid}/${Date.now()}`;
      const imageRef = storageRef(storage, imageName);

      await uploadBytes(imageRef, blob);
      const imageUrl = await constructDownloadURL(imageRef); // Construct download URL manually

      // Add document to Firestore
      await addDoc(collection(db, "images"), {
        imageUrl: imageUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Image uploaded successfully");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image. Please try again later.");
    }
  };

  const constructDownloadURL = async (ref) => {
    const storageBucket = ref.storage.app.options.storageBucket;
    const fullPath = encodeURIComponent(ref.fullPath);
    return `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${fullPath}?alt=media`;
  };

  const [selectedVideo, setSelectedVideo] = useState(null);
  const openVideoPicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission denied",
        "You need to grant permission to access the media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) {
      Alert.alert("No video selected", "Please select a video first.");
      return;
    }

    try {
      const response = await fetch(selectedVideo);
      const blob = await response.blob();
      const storage = getStorage();
      const videoName = `videos/${user.uid}/${Date.now()}`;
      const videoRef = storageRef(storage, videoName);

      await uploadBytes(videoRef, blob);

      // Construct the download URL manually using the metadata of the upload task snapshot
      const videoUrl = await constructDownloadURL(videoRef);

      // Add document to Firestore
      await addDoc(collection(db, "videos"), {
        videoUrl: videoUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Video uploaded successfully");
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error uploading video:", error);
      Alert.alert("Error", "Failed to upload video. Please try again later.");
    }
  };

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      cameraType: "front",
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  //fetch from firestore
  const fetchImageData = async (userId, type) => {
    try {
      // Create a query to find documents where the "userId" field matches the specified userId
      const q = query(collection(db, type), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If there's at least one matching document, use the first one found
        const docSnap = querySnapshot.docs[0];
        if (type === "images") {
          setImageUrlFromFirestore(docSnap.data().imageUrl);
        } else if (type === "videos") {
          setVideoUrlFromFirestore(docSnap.data().videoUrl);
        }
      } else {
        setImageUrlFromFirestore("No imageurl found for this user.");
      }
    } catch (error) {
      console.error("Error fetching text data:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text>pics</Text>
      <Button title="Select Image from Gallery" onPress={openImagePicker} />
      <Button title="camera image" onPress={openCamera} />
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>Selected Image:</Text>
          <Text>{selectedImage}</Text>
          <Button title="Upload Image" onPress={uploadImage} />
        </View>
      )}
      <Text>Video</Text>
      <Button title="Select Video from Gallery" onPress={openVideoPicker} />
      {selectedVideo && (
        <View style={styles.videoContainer}>
          <Text style={styles.videoText}>Selected Video:</Text>
          <Text>{selectedVideo}</Text>
          <Button title="Upload Video" onPress={uploadVideo} />
        </View>
      )}
      {videoUri && (
        <View className="">
          <Text style={styles.videoText}>Recorded Video:</Text>
          <Text>{videoUri}</Text>
          <Button title="Upload Video" onPress={() => uploadVideo(videoUri)} />
        </View>
      )}

      <Camera className="" type={type} ref={cameraRef}>
        <View style={styles.cameraButtons}>
          <Button
            title={isRecording ? "Stop Recording" : "Record Video"}
            onPress={isRecording ? stopRecording : startRecording}
          />
        </View>
      </Camera>

      <Text>Get Url from firestore</Text>

      <Text>imageurl: {imageUrlFromFirestore}</Text>
      <Button
        title="fetch image"
        onPress={() => fetchImageData(user.uid, "images")}
      />
      <Text>videoUrl: {videoUrlFromFirestore}</Text>

      <Button
        title="fetch Video"
        onPress={() => fetchImageData(user.uid, "videos")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  imageText: {
    fontWeight: "bold",
  },
});

export default CameraUploader;
