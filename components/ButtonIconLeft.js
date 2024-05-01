import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const ButtonIconLeft = ({ buttonText, iconName, onPress }) => {
  return (
    <Pressable
      className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded flex items-center justify-center flex-row"
      onPress={onPress}
    >
      <Text className="text-xl font-bold text-white mr-1">{buttonText}</Text>
      <Ionicons name={iconName} size={24} color="white" />
    </Pressable>
  );
};

export default ButtonIconLeft;
