import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { db } from "../../utils/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Modal,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuthentication from "../../hooks/useAuthentication";
function TextForm({ selectedVideo, setSelectedVideo, descriptionGiven }) {
  const { user } = useAuthentication();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
    },
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const description = watch("description");
  const onSubmit = (data) => {
    console.log("Submitted Data:", data);

    setSubmittedData(data);
    // uploadVideoAndText(data.description);
  };

  // const handleSubmitAndUpload = async () => {
  //   handleSubmit(onSubmit);
  //   console.log("push data to firestore and storage");
  // };

  //upload video and text

  const constructDownloadURL = async (ref) => {
    const storageBucket = ref.storage.app.options.storageBucket;
    const fullPath = encodeURIComponent(ref.fullPath);
    return `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${fullPath}?alt=media`;
  };
  const uploadVideoAndText = async (text) => {
    setLoading(true);
    if (!selectedVideo) {
      setLoading(false);
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
      await addDoc(collection(db, "generate"), {
        videoUrl: videoUrl,
        userId: user.uid,
        content: description,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Video uploaded successfully");
      setSelectedVideo(null);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading video:", error);
      Alert.alert("Error", "Failed to upload video. Please try again later.");
      setLoading(false);
    }
  };
  return (
    <View>
      <Modal
        visible={loading}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          /** Intentionally left blank to disable Android back button action */
        }}
      >
        <View
          className="flex-1 items-center justify-center  "
          style={{ backgroundColor: "rgba(0, 0, 0, 0.60)" }}
        >
          <View className="items-center justify-center p-20 bg-white rounded">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="text-gray-500  text-lg m-2 font-semibold">
              uploading...
            </Text>
          </View>
        </View>
      </Modal>

      <View>
        <Text
          className={`text-xs ${
            description.length < 28 ? "text-gray-500" : "text-green-500"
          } `}
        >
          {description.length}/28
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              //   multiline
              //   numberOfLines={3} // Sets the minimum number of lines to three
              onChangeText={onChange} // Bind the onChangeText to onChange
              onBlur={onBlur} // Bind the onBlur to onBlur
              value={value} // Bind the value to value
              style={styles.input} // Apply the input style
              className="text-xl rounded max-w-full w-full h-40 min-w-full border-2 border-gray-300 p-2 mb-4 "
              placeholder="Describe your video here"
              //   returnKeyType="done" // Set the return key to "done"
              blurOnSubmit={true}
              keyboardType="default"
              returnKeyType="done"
              multiline={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
          )}
          name="description"
          rules={{
            required: "You must enter a description for the AI to work",
            minLength: {
              value: 28,
              message: "Description must be at least 28 characters long",
            },
          }}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}

        {submittedData && (
          <View style={styles.submittedContainer}>
            <Text style={styles.submittedTitle}>Submitted Data:</Text>
            <Text>Description: {submittedData.description}</Text>
          </View>
        )}
        {/* {selectedVideo && ( */}
        <View className="flex flex-col   justify-center ">
          <Text className="pb-4 text-lg leading-relaxed font-normal text-left ">
            Upload your video to issue your press release. Your friends and
            families comments might also make the nightly news
          </Text>
          <Pressable
            className={`bg-red-500 ${
              description.length < 28 ? "bg-gray-500" : "hover:bg-red-700"
            } text-white font-bold py-2 mb-2 rounded flex items-center justify-center flex-row`}
            onPress={() => {
              if (description.length > 28) {
                // handleSubmitAndUpload();
                // handleSubmit(onSubmit);
                uploadVideoAndText();
              } else {
                alert("Please add a description of more than 28 characters");
              }
            }}
          >
            <Text className="text-xl font-bold text-white mr-1">Upload</Text>
            <Ionicons name="arrow-up-circle" size={24} color="white" />
          </Pressable>

          <Button
            title="Select a different video"
            onPress={() => setSelectedVideo(null)}
          />
        </View>
        {/* )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    // height: 90, // Adjust height to accommodate multiple lines
    // borderColor: "gray",
    // borderWidth: 1,
    // marginBottom: 10,
    // padding: 8,
    // textAlignVertical: "top", // Align text at the top-left corner
    // width: "100%", // Make input stretch to full width
    // minWidth: "100%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  submittedContainer: {
    marginTop: 10,
  },
  submittedTitle: {
    fontWeight: "bold",
  },
});

export default TextForm;
