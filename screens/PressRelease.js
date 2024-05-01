import { View, Pressable, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import NoVideoBottomContent from "../components/PressReleaseNoVid.js/NoVideoBottomContent";
import { Video } from "expo-av";
import TextForm from "../components/PressReleaseNoVid.js/TextForm";
import TopText from "../components/PressReleaseNoVid.js/TopText";
const PressRelease = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);
  const [descriptionGiven, setDescriptionGiven] = useState(false);
  const [fullScreenVideo, setFullScreenVideo] = useState(false);
  async function takeVideo() {
    // Request the necessary camera permissions from the user
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You need to grant permission to use the camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Set to capture only videos
      allowsEditing: true, // Optionally allow editing
      quality: 0.5, // Optionally adjust the quality, here set to medium
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
    }
  }
  async function selectVideoFromGallery() {
    // Request the necessary permissions from the user
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You need to grant permission to access the media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Set to pick only videos
      allowsEditing: true, // Optionally allow editing
      quality: 1, // Optionally set the quality, 1 for high quality
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
    }
  }

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!fullScreenVideo) {
        videoRef.current.presentFullscreenPlayer();
      } else {
        videoRef.current.dismissFullscreenPlayer();
      }
      setFullScreenVideo(!fullScreenVideo);
    }
  };
  return (
    <KeyboardAvoidingView className="flex-1 bg-gray-50 p-4 flex items-center text-gray-600">
      {/* <View className="w-full pb-4">
        <Text className="text-3xl font-bold mb-4 text-left">
          {selectedVideo ? "Your Video" : "Issue a Press Release"}
        </Text>

        <Text className="pb-2 text-lg leading-relaxed font-semibold text-left ">
          Make the news.
        </Text>
      </View> */}
      <TopText selectedVideo={selectedVideo} />
      {selectedVideo && <FormQuestions />}
      {selectedVideo && (
        <TextForm
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
          descriptionGiven={descriptionGiven}
        />
      )}
      {!selectedVideo && (
        <View className="w-full flex-1 rounded bg-red-50 items-center justify-center my-6">
          <Ionicons name="videocam" size={128} color="white" />
        </View>
      )}

      {!selectedVideo && (
        <NoVideoBottomContent
          selectVideoFromGallery={selectVideoFromGallery}
          takeVideo={takeVideo}
        />
      )}

      {selectedVideo && (
        <View
          className={`"w-1/4 h-1/4  top-5 right-5 rounded shadow  absolute`}
        >
          <Pressable
            className="absolute w-full h-full z-50"
            onPress={toggleFullScreen}
            // onPress={() => setFullScreenVideo(true)}
          />
          <Video
            ref={videoRef}
            source={{ uri: selectedVideo }}
            resizeMode="cover"
            useNativeControls={true}
            shouldPlay={true}
            presentFullscreenPlayer={true}
            isMuted={true}
            showPoster={true}
            isLooping={true}
            className="w-[80] h-[150] rounded shadow"
            // style={styles.smallVideo}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default PressRelease;
