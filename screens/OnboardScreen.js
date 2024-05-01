import {
  Alert,
  StatusBar,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import React from "react";

import Onboarding from "react-native-onboarding-swiper";

const OnboardScreen = ({ navigation }) => {
  const navigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };
  return (
    <Onboarding
      showDone={false}
      onSkip={() => navigateToLogin()}
      bottomBarColor="white"
      bottomBarHighlight={false}
      titleStyles={{ color: "blue" }}
      pages={[
        {
          title: "Hey!",
          subtitle: "Welcome to $App!",
          backgroundColor: "white",
          image: <View className="bg-red-500 h-20 w-20 rounded" />,
        },
        {
          title: "Send Messages",
          subtitle: "You can reach everybody with us",
          backgroundColor: "white",
          image: <View className="bg-red-500 h-20 w-20 rounded" />,
        },
        {
          title: "Get Notified",
          subtitle:
            "We will send you notification as soon as something happened",
          backgroundColor: "white",
          image: <View className="bg-red-500 h-20 w-20 rounded" />,
        },
        {
          title: "That's Enough",
          subtitle: (
            <View className="">
              <TouchableOpacity
                onPress={navigateToLogin}
                className="rounded-full bg-green-700 px-5 py-3 mt-2.5 mb-5 justify-center items-center w-full "
              >
                <Text className="text-white font-bold text-lg">
                  Check my plants
                </Text>
              </TouchableOpacity>
            </View>
          ),
          backgroundColor: "white",
          image: <View className="bg-red-500 h-20 w-20 rounded" />,
        },
      ]}
    />
  );
};

export default OnboardScreen;
