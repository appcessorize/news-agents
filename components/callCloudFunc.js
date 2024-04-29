import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { functions } from "../utils/firebaseConfig"; // Import functions directly
import { httpsCallable } from "firebase/functions";
const CallCloudFunc = () => {
  const [responseText, setResponseText] = useState("");
  //   const callHTTPFunction = async () => {
  //     console.log("calling..");
  //     const url = "https://tts-wzai62ql7a-uc.a.run.app";
  //     const functions = functions; // 'app' should be your Firebase app instance
  //     const tts = httpsCallable(functions, "tts");

  //     try {
  //       console.log("try calling..");
  //       const response = await fetch(url);
  //       console.log(response);
  //       const data = await response.json();
  //       console.log(data); // Parse the JSON response
  //       setResponseText(data.text); // Set the response text
  //     } catch (error) {
  //       console.error("Failed to call the function:", error);
  //       setResponseText("Failed to get response");
  //     }
  //   };
  const callCallableFunction = async () => {
    console.log("called");
    // Get functions instance linked to your Firebase app
    const tts = httpsCallable(functions, "ttscall"); // Create a reference to the callable function

    try {
      const result = await tts(); // Call the function with any data you need to send
      console.log(result, "result");
      //   setResponseText(result.data.text); // Access result data returned from the function
    } catch (error) {
      console.error("Error calling Firebase function:", error);
      setResponseText("Error calling function");
    }
  };
  return (
    <View>
      <Text>call cloud func</Text>
      <Text>{responseText}</Text>
      {/* <Button
        onPress={callHTTPFunction}
        title=" callHTTPFunction Cloud Function"
      /> */}
      <Button onPress={callCallableFunction} title=" call Callable Function " />
    </View>
  );
};

export default CallCloudFunc;
