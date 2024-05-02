import { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
// import { buildLink } from "firebase/dynamic-links"; // Ensure you import from the correct Firebase SDK
import useAuthentication from "../hooks/useAuthentication";
import * as Linking from "expo-linking";
const AddFriends = () => {
  const { user } = useAuthentication();
  useEffect(() => {
    const handleDeepLink = (event) => {
      let data = Linking.parse(event.url);
      console.log(data);
      // Handle the URL, e.g., extract parameters and navigate or initiate actions
    };

    // Listen for incoming links
    Linking.addEventListener("url", handleDeepLink);

    // Check if the app was opened by a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-around ">
      {user && <Text>add friends my user id{user.uid}</Text>}
    </View>
  );
};

export default AddFriends;
