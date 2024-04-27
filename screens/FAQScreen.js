import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const FAQScreen = ({ navigation }) => {
  const faqs = [
    {
      question: "What is React Native?",
      answer:
        "React Native is a framework for building native apps using React.",
    },
    {
      question: "Why use React Native?",
      answer:
        "It allows developers to use React along with native platform capabilities.",
    },
    {
      question: "How do I install React Native?",
      answer:
        "You can install React Native by running `npm install -g react-native-cli`.",
    },
    // Add more FAQs as needed
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-10 h-10 bg-red-500 rounded-full items-center justify-center mb-4"
      >
        <Text className="text-white text-xl">X</Text>
      </TouchableOpacity>
      <ScrollView>
        <Text className="text-xl font-bold mb-4">FAQ</Text>
        {faqs.map((faq, index) => (
          <View key={index} className="mb-4">
            <Text className="text-lg font-semibold">{faq.question}</Text>
            <Text className="text-gray-700">{faq.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FAQScreen;
