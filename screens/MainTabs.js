import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewsRoom from "./NewsRoom";
import PressRelease from "./PressRelease";
import AboutTab from "./AboutTab";
import { Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "About") {
            iconName = focused
              ? "information-circle"
              : "information-circle-outline";
          } else if (route.name === "News Room") {
            iconName = focused ? "newspaper" : "newspaper-outline";
          } else if (route.name === "Press Release") {
            iconName = focused ? "megaphone" : "megaphone-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      // tabBarOptions={{
      //   activeTintColor: "tomato",
      //   inactiveTintColor: "gray",
      // }}
    >
      <Tab.Screen name="News Room" component={NewsRoom} />
      <Tab.Screen name="Press Release" component={PressRelease} />
      <Tab.Screen name="About" component={AboutTab} />
    </Tab.Navigator>
  );
}
