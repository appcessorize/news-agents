import LoginLogout from "../components/loginLogout";
import { View, Text } from "react-native";
const LoginScreen = () => {
  return (
    <View className="flex-1 items-center justify-around">
      <Text className="pb-2 text-lg leading-relaxed font-bold italic bg-red-500 text-white text-left ">
        MENN
      </Text>
      <Text className="pb-2 text-md leading-relaxed font-normal text-left ">
        Make the news.
      </Text>

      <LoginLogout />
    </View>
  );
};

export default LoginScreen;
