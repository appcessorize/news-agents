import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const AboutTab = () => {
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
      <ScrollView>
        <Text className="text-xl font-bold mb-4">What is this app?</Text>
        <Text className="text-gray-700  mb-4 ">blah blah blah</Text>
        <Text className="text-xl font-bold mb-4">How does it work?</Text>
        <Text className="text-gray-700  mb-4 ">blah blah blah</Text>
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

export default AboutTab;
