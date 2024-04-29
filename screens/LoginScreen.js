import LoginLogout from "../components/loginLogout";
import { View } from "react-native";
const LoginScreen = () => {
  return (
    <View className="flex-1 items-center justify-around bg-red-500">
      <LoginLogout />
    </View>
  );
};

export default LoginScreen;
