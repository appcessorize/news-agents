import { View, Text, Button, ActivityIndicator, Pressable } from "react-native";
import { db } from "../utils/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
} from "firebase/firestore";
import useCurrentLocation from "../hooks/useWeather";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ButtonIconLeft from "../components/ButtonIconLeft";
const NewsRoom = () => {
  const navigation = useNavigation();
  const {
    errorMsg,
    loading,

    weather,
    weatherLoading,
    weatherError,
  } = useCurrentLocation();

  const addWeatherToFirestore = async (content) => {
    try {
      const docRef = await addDoc(collection(db, "generate"), {
        content: content,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const getWeatherDataFromFireStore = async () => {
    try {
      const q = query(collection(db, "generate"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.output) {
            console.log("Raw output before cleaning:", data.output); // Log raw output

            // Remove the markdown code block syntax more accurately and any leading/trailing whitespace
            const preliminaryClean = data.output
              .replace(/```js|```/g, "")
              .trim();
            // Further refine cleaning by ensuring no non-JSON characters remain
            const startIndex = preliminaryClean.indexOf("{");
            const endIndex = preliminaryClean.lastIndexOf("}") + 1;
            const cleanOutput = preliminaryClean.substring(
              startIndex,
              endIndex
            );

            console.log("Cleaned Output ready for parsing:", cleanOutput); // Log cleaned output

            try {
              const outputObject = JSON.parse(cleanOutput);
              console.log(doc.id, "=>", outputObject);
            } catch (e) {
              console.error("Error parsing data into object", e);
            }
          }
        });
      } else {
        console.log("No documents found.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  //   try {
  //     // Create a query to find documents where the "userId" field matches the specified userId
  //     const q = query(collection(db, "text"), where("userId", "==", userId));
  //     const querySnapshot = await getDocs(q);

  //     if (!querySnapshot.empty) {
  //       // If there's at least one matching document, use the first one found
  //       const docSnap = querySnapshot.docs[0];
  //       setTextFromFirestore(docSnap.data().textContent);
  //       setTextLoading(false);
  //     } else {
  //       setTextLoading(false);
  //       setTextFromFirestore("No text data found for this user.");
  //     }
  //   } catch (error) {
  //     setTextLoading(false);
  //     console.error("Error fetching text data:", error);
  //   }
  const [hasStories, setHasStories] = useState(false);
  //       2: "Partly cloudy",
  //       3: "Overcast",
  //       45: "Fog",
  //       48: "Depositing rime fog",
  //       51: "Light drizzle",
  //       56: "Freezing drizzle",
  //       61: "Light rain",
  //       63: "Moderate rain",
  //       65: "Heavy rain",
  //       66: "Freezing rain",
  //       67: "Heavy freezing rain",
  //       71: "Light snow fall",
  //       73: "Moderate snow fall",
  //       75: "Heavy snow fall",
  //       77: "Snow grains",
  //       80: "Light rain showers",
  //       81: "Moderate rain showers",
  //       82: "Heavy rain showers",
  //       85: "Light snow showers",
  //       86: "Heavy snow showers",
  //       95: "Thunderstorm",
  //       96: "Thunderstorm with light hail",
  //       99: "Thunderstorm with heavy hail",
  //     };
  //     return codes[code] || "Weather data not available";
  //   };

  //   const dataForFirestore = () => {
  //     let weatherDescription = getWeatherDescription(weather.code);
  //     console.log("weatherDescription", weatherDescription);
  //     if (weatherDescription) {
  //       addWeatherToFirestore(
  //         ` The weather tomorrow will be ${weatherDescription}} with a min temp of ${weather.minTemp} degrees c and a max temp of ${weather.maxTemp} degrees c`
  //       );
  //     }
  //   };
  return (
    // <View className="flex-1 items-center justify-around ">
    //   {loading || weatherLoading ? (
    //     <ActivityIndicator size="large" color="#0000ff" />
    //   ) : errorMsg || weatherError ? (
    //     <Text>{errorMsg || weatherError}</Text>
    //   ) : weather ? (
    //     <Text>{weather}</Text>
    //   ) : (
    //     <Text>Weather data not available</Text>
    //   )}

    //   <Button
    //     title="send weather content to firestore"
    //     onPress={() => addWeatherToFirestore(weather)}
    //   />
    //   <Button
    //     title="Get weather content from firestore"
    //     onPress={() => getWeatherDataFromFireStore()}
    //   />
    //   <View>
    //     <Text>My stories </Text>
    //     <Text>Story components </Text>
    //     <Text>-----------</Text>
    //     <Text>others stories </Text>
    //     <Text>Story components with comment</Text>
    //   </View>
    // </View>

    <View className="flex-1 bg-gray-50 p-4 flex items-center">
      <View className="w-full pb-4">
        <Text className="text-3xl font-bold mb-4 text-left">News Room</Text>

        <Text className="pb-2 text-lg leading-relaxed text-gray-600 font-semibold text-left ">
          Comment on your friends stories
        </Text>
      </View>

      {hasStories ? (
        <View></View>
      ) : (
        <View className="w-full pb-4">
          <Text className="pb-2 text-lg leading-relaxed font-normal text-left ">
            This is where your AI journalist interviews You about your fiends
            stories.
          </Text>
          <Text className="pb-4 text-lg leading-relaxed font-normal text-left ">
            Your friends haven't asked you to comment yet
          </Text>
          <View className="flex flex-row  justify-center space-x-2">
            {/* <Pressable
              className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded flex items-center justify-center flex-row"
              onPress={() => console.log("pressed")}
            >
              <Text className="text-xl font-bold text-white mr-1">
                Add Friends
              </Text>
              <Ionicons name="add-circle" size={24} color="white" />
            </Pressable> */}
            <ButtonIconLeft
              buttonText="Add Friends"
              iconName="add-circle"
              onPress={() => console.log("pressed")}
            />
            <Pressable
              className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded flex items-center justify-center flex-row"
              onPress={() => console.log("pressed")}
            >
              <Entypo name="modern-mic" size={24} color="white" />
              <Text
                className="text-xl font-bold text-white ml-1"
                onPress={() => navigation.navigate("InterviewScreen")}
              >
                Try It Out
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default NewsRoom;
