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
import { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import * as Linking from "expo-linking";

import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import Onboarding from "react-native-onboarding-swiper";
import LoginLogout from "../components/loginLogout";

const OnboardScreen = ({ navigation }) => {
  const openSettings = async () => {
    const url = "app-settings:";
    // Check if the device can open this URL
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "Unable to open settings");
    }
  };

  const requestPermissionAgain = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "You need to enable permissions in Settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: openSettings },
        ]
      );
    }
  };
  // async function requestCameraPermission() {
  //   const { status: cameraStatus } =
  //     await Camera.requestCameraPermissionsAsync();
  //   if (cameraStatus !== "granted") {
  //     alert("Sorry, we need camera permissions to make this work!");
  //   }
  //   // Request Media Library Permission
  //   const { status: mediaLibraryStatus } =
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (mediaLibraryStatus !== "granted") {
  //     alert("Sorry, we need camera roll permissions to make this work!");
  //   }
  // }

  // async function getNotificationPermissions() {
  //   // Request Camera Permission

  //   // Notifications Permission
  //   const { status: notificationsStatus } =
  //     await Notifications.requestPermissionsAsync();
  //   if (notificationsStatus !== "granted") {
  //     alert("Sorry, we need notification permissions to make this work!");
  //   }
  // }

  // useEffect(() => {
  //   getPermissions();
  // }, []);

  const navigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  //new code

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    // Check Camera Permission
    const cameraPermission = await Camera.getCameraPermissionsAsync();
    setHasCameraPermission(cameraPermission.status === "granted");

    // Check Media Library Permission
    const galleryPermission =
      await ImagePicker.getMediaLibraryPermissionsAsync();
    setHasGalleryPermission(galleryPermission.status === "granted");

    // Check Notifications Permission
    const notificationPermission = await Notifications.getPermissionsAsync();
    setHasNotificationPermission(notificationPermission.status === "granted");
  }

  async function requestCameraPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please enable camera access from the settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    } else {
      setHasCameraPermission(status === "granted");
    }
  }

  async function requestGalleryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please enable Gallery access from the settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    } else {
      setHasGalleryPermission(status === "granted");
    }
  }

  async function requestNotificationPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please enable Notification access from the settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    } else {
      setHasNotificationPermission(status === "granted");
    }
  }
  return (
    <Onboarding
      showDone={false}
      onSkip={() => navigateToLogin()}
      bottomBarColor="white"
      bottomBarHighlight={false}
      titleStyles={{ color: "blue" }}
      pages={[
        {
          title: "MENN",
          subtitle:
            "MENN turns you and your friends short videos into am AI generated nightly news report",
          backgroundColor: "white",
          image: <View className="bg-red-500 h-20 w-20 rounded" />,
        },
        // {
        //   title: "Share with the people you trust",
        //   subtitle: "You can reach everybody with us",
        //   backgroundColor: "white",
        //   image: <View className="bg-red-500 h-20 w-20 rounded" />,
        // },
        // {
        //   title: "Stop doomscrolling",
        //   subtitle: "One report to catch up on your friends news",
        //   backgroundColor: "white",
        //   image: <View className="bg-red-500 h-20 w-20 rounded" />,
        // },
        {
          title: "That's Enough",
          subtitle: (
            <View className="">
              {hasCameraPermission &&
                hasGalleryPermission &&
                hasNotificationPermission && <LoginLogout />}
              {!hasCameraPermission ||
                !hasGalleryPermission ||
                (!hasNotificationPermission && (
                  <Text>We need some permissions to go ahead</Text>
                ))}
              {!hasCameraPermission && (
                <Button
                  title="Grant Camera Permission"
                  onPress={() => requestCameraPermission()}
                />
              )}
              {!hasGalleryPermission && (
                <Button
                  title="Grant Gallery Permission"
                  onPress={() => requestGalleryPermission()}
                />
              )}
              {!hasNotificationPermission && (
                <Button
                  title="Grant Notification Permission"
                  onPress={() => requestNotificationPermission()}
                />
              )}
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
