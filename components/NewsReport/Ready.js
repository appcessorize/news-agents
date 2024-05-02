import { View, Text, Pressable, SafeAreaView } from "react-native";
import ButtonIconLeft from "../ButtonIconLeft";
import { Ionicons } from "@expo/vector-icons";
const Ready = ({ startNewsReport }) => {
  return (
    <SafeAreaView className="bg-gray-50 w-full h-full flex justify-around items-center z-50 ">
      {/* <View className="pointer-events-none flex-row w-full bg-white shadow "> */}
      <View className="bg-red-600 pl-2 pr-3 py-3 items-center justify-center flex flex-row absolute top-20 left-0">
        <Ionicons name="globe-outline" size={40} color="white" />
        <Text className=" text-5xl text-white shadow font-extrabold italic pl-2">
          MENN
        </Text>
      </View>
      <View className="mt-8">
        <Text className="pb-4 px-4 text-lg leading-relaxed font-normal text-left ">
          Todays AI generated news report is ready
        </Text>
        <Text className="pb-4 px-4 text-lg leading-relaxed font-normal text-left ">
          See what your friends have been up to
        </Text>
      </View>
      <Pressable
        className=" bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-4  w-2/3 mb-4 rounded flex items-center justify-center flex-row"
        onPress={() => console.log("pressed")}
      >
        <Ionicons name="play-circle" size={24} color="white" />
        <Text
          className="text-xl font-bold text-white ml-1"
          onPress={startNewsReport}
        >
          Play
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Ready;
