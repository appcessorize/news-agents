import { View, Text } from "react-native";

const TopText = ({ selectedVideo }) => {
  return (
    <View className="w-full pb-4">
      <Text className="text-3xl font-bold mb-4 text-left">
        {selectedVideo ? "Your Video" : "Issue a Press Release"}
      </Text>

      <Text className="pb-2 text-lg leading-relaxed font-semibold text-left ">
        Make the news.
      </Text>
    </View>
  );
};

export default TopText;
