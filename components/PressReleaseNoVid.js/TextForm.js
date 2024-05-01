import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
function TextForm({ selectedVideo, setSelectedVideo, descriptionGiven }) {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
    },
  });
  const [submittedData, setSubmittedData] = useState(null);
  const description = watch("description");
  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    setSubmittedData(data);
  };

  const handleSubmitAndUpload = async () => {
    handleSubmit(onSubmit);
    console.log("push data to firestore and storage");
  };

  return (
    <View>
      <View>
        <Pressable onPress={() => Keyboard.dismiss()}>
          <Text>Dismiss</Text>
        </Pressable>
        <Text
          className={`text-xs ${
            description.length < 30 ? "text-gray-500" : "text-green-500"
          } `}
        >
          {description.length}/30
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              //   multiline
              //   numberOfLines={3} // Sets the minimum number of lines to three
              onChangeText={onChange} // Bind the onChangeText to onChange
              onBlur={onBlur} // Bind the onBlur to onBlur
              value={value} // Bind the value to value
              style={styles.input} // Apply the input style
              className="text-xl rounded max-w-full w-full h-40 min-w-full border-2 border-gray-300 p-2 mb-4 "
              placeholder="Describe your video here"
              //   returnKeyType="done" // Set the return key to "done"
              blurOnSubmit={true}
              keyboardType="default"
              returnKeyType="done"
              multiline={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
          )}
          name="description"
          rules={{
            required: "You must enter a description for the AI to work",
            minLength: {
              value: 30,
              message: "Description must be at least 30 characters long",
            },
          }}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}

        {submittedData && (
          <View style={styles.submittedContainer}>
            <Text style={styles.submittedTitle}>Submitted Data:</Text>
            <Text>Description: {submittedData.description}</Text>
          </View>
        )}
        {/* {selectedVideo && ( */}
        <View className="flex flex-col   justify-center ">
          <Text className="pb-4 text-lg leading-relaxed font-normal text-left ">
            Upload your video to issue your press release. Your friends and
            families comments might also make the nightly news
          </Text>
          <Pressable
            className={`bg-red-500 ${
              description.length < 30 ? "bg-gray-500" : "hover:bg-red-700"
            } text-white font-bold py-2 mb-2 rounded flex items-center justify-center flex-row`}
            onPress={() => {
              if (description.length < 30) {
                handleSubmitAndUpload();
              } else {
                alert("Please add a description of more than 30 character");
              }
            }}
          >
            <Text className="text-xl font-bold text-white mr-1">Upload</Text>
            <Ionicons name="arrow-up-circle" size={24} color="white" />
          </Pressable>

          <Button
            title="Select a different video"
            onPress={() => setSelectedVideo(null)}
          />
        </View>
        {/* )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    // height: 90, // Adjust height to accommodate multiple lines
    // borderColor: "gray",
    // borderWidth: 1,
    // marginBottom: 10,
    // padding: 8,
    // textAlignVertical: "top", // Align text at the top-left corner
    // width: "100%", // Make input stretch to full width
    // minWidth: "100%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  submittedContainer: {
    marginTop: 10,
  },
  submittedTitle: {
    fontWeight: "bold",
  },
});

export default TextForm;
