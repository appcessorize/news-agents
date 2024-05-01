import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import FAQScreen from "./screens/FAQScreen";
import useAuthentication from "./hooks/useAuthentication";
import LoginScreen from "./screens/LoginScreen";
import PressRelease from "./screens/PressRelease";
import MainTabs from "./screens/MainTabs";
import InterviewScreen from "./screens/InterviewScreen";
import OnboardScreen from "./screens/OnboardScreen";
import NewsReport from "./screens/NewsReport";
export default function App() {
  const { user } = useAuthentication();
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="NewsReport"
            component={NewsReport}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PressRelease"
            component={PressRelease}
            options={{ headerShown: false }}
          />

          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen
              name="FAQScreen"
              component={FAQScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InterviewScreen"
              component={InterviewScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="OnboardScreen"
            component={OnboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
