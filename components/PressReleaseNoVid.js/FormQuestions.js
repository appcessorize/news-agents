import { View, Text } from "react-native";

const FormQuestions = () => {
  return (
    <View className="flex   justify-start w-full item-center ">
      <View>
        <Text className="pb-2 text-lg leading-relaxed font-normal text-left ">
          Tell us about your video
        </Text>
        <Text className="pb-4 text-lg leading-relaxed font-normal text-left ">
          What's it about?
        </Text>
      </View>
    </View>
  );
};

export default FormQuestions;
