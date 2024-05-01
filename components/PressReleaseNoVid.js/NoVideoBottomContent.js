import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NoVideoBottomContent = ({ selectVideoFromGallery, takeVideo }) => {
  return (
    <View className="w-full pb-4">
      <Text className="pb-2 text-lg leading-relaxed font-normal text-left ">
        Every night at 8PM Me News Network posts an AI generated bulletin to
        your friends and family.
      </Text>
      <Text className="pb-4 text-lg leading-relaxed font-normal text-left ">
        Want to be included?
      </Text>
      <Text className="pb-4 text-lg leading-relaxed font-normal text-left ">
        Post a short video.
      </Text>
      <View className="flex flex-row  justify-center space-x-2">
        <Pressable
          className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded flex items-center justify-center flex-row"
          onPress={selectVideoFromGallery}
        >
          <Text className="text-xl font-bold text-white mr-1">Gallery</Text>
          <Ionicons name="images" size={24} color="white" />
        </Pressable>

        <Pressable
          className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded flex items-center justify-center flex-row"
          onPress={takeVideo}
        >
          <Ionicons name="videocam" size={24} color="white" />
          <Text className="text-xl font-bold text-white ml-1">Take Video</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NoVideoBottomContent;
