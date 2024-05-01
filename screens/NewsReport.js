import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  SafeAreaView,
} from "react-native";
import { Audio, Video } from "expo-av";

import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
const videos = {
  newsintro: require("../assets/videos/newsintro.mp4"),
  hugoSleeping: require("../assets/videos/hugoSleeping.mp4"),
  mennIntro: require("../assets/videos/mennIntro.mov"),
  test: require("../assets/videos/test.mov"),
  lindaCoffee: require("../assets/videos/lindaCoffee.mp4"),
  goalScorer: require("../assets/videos/goalScorer.mp4"),
  water: require("../assets/videos/water.mp4"),
  paulViolin: require("../assets/videos/paulViolin.mp4"),
  // karateNico: require("./assets/karateNico.MP4"),
};
const NewsReport = () => {
  //dummy Ai generated content for the demo
  const anchorScript = [
    {
      videoKey: "mennIntro",
      bannerText: "Rainy weather tomorrow, with mild temperatures.",
      speech:
        "Moderate rain is expected tomorrow. The minimum temperature will be 8.9 degrees Celsius, with a maximum of 11 degrees Celsius.",
      squareBg: "Rainy",
      squareBgEmoji: "🌧️",
    },
    {
      speech:
        "Welcome to me news network news. a.i genrated personalized news made with your friends and family",
      videoKey: "mennIntro",
      squareBg: "NEWS",
      squareBgEmoji: "📰",
      bannerText: "Welcome to the news",
    },
    {
      speech: "Paul is practicing for his big performance on the weekend",

      videoKey: "paulViolin",
      squareBg: "MUSIC",
      squareBgEmoji: "🎧",
      bannerText: "Paul's performance",
    },
    {
      speech: "and sports news now. Nico just missed a goal",

      videoKey: "goalScorer",
      squareBg: "SPORT",
      squareBgEmoji: "⚽️",
      bannerText: "Near miss from striker",
    },
    {
      speech:
        "New zealand news. Linda gives her verdict on the new coffee shop",

      videoKey: "lindaCoffee",
      squareBg: "COFFEE",
      squareBgEmoji: "☕️",
      bannerText: "Coffee verdict in",
    },
    {
      speech:
        "Over to vigo village now where Hugo the dog is having his birthday. Happy birthday Hugo",
      videoKey: "hugoSleeping",
      squareBg: "PETS",
      squareBgEmoji: "🐶",
      bannerText: "Happy birthday Hugo",
    },
    {
      speech: "Now the weather",
      squareBg: "WEATHER",
      videoKey: "water",
      squareBgEmoji: "🌧️",
      bannerText: "blah blah blah",
    },
    {
      speech:
        "Me.n.n will be back tomorrow at 8 p.m. so from me and the team good night. and remember to post your press releases and reactions in the app to make tomorrows update ",
      squareBg: "Goodbye",
      videoKey: "mennIntro",
      squareBgEmoji: "👋",
      bannerText: "See you at 8pm tomorrow",
    },
  ];
  const animation = useRef(null);
  const indexRef = useRef(0);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [updateStarted, setUpdateStarted] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      animation.current.play();
    } else {
      animation.current.reset();
    }
  }, [isPlaying]);

  // native tts
  const [i, setI] = useState(0);
  const onTtsdone = () => {
    // animation.current.reset();
    // videoRef.current.playAsync();
    animation.current.reset();
    setPlayVideo(true);
  };

  const speak = () => {
    const thingToSay = anchorScript[indexRef.current].speech;
    Speech.speak(thingToSay, { onDone: onTtsdone });
    let isSpeaking = Speech.isSpeakingAsync();
    if (isSpeaking) {
      animation.current.play();
    }
  };

  //video
  useEffect(() => {
    if (playVideo && videoRef.current) {
      videoRef.current.playAsync();
    }
  }, [playVideo]);

  const handleVideoStatusUpdate = async (status) => {
    if (status.didJustFinish && !status.isLooping) {
      // The video has finished playing and it is not looping

      await videoRef.current.setPositionAsync(0); // Reset video to start
      setPlayVideo(false); // Optionally stop the video from auto-restarting
      //   setI((prevI) => prevI + 1);
      indexRef.current = indexRef.current + 1;
      console.log(" vid status i", i);
      speak();
    }
  };

  return (
    <View className="w-full h-full bg-blue-50 flex items-center justify-end">
      <Image
        source={require("../assets/newsBgEdited.jpeg")}
        className="w-full h-full absolute top-0 left-0"
      />

      {!playVideo && (
        <View
          className={`absolute top-20 right-10 rounded bg-red-500 w-[150] h-[150] flex items-center justify-center shadow-md`}
        >
          <Text className="text-3xl font-bold  ">
            {anchorScript[indexRef.current].squareBgEmoji}
          </Text>
          <View
            className={` absolute bottom-0  w-full flex justify-center items-center pb-2 `}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
          >
            <Text className={`text-xl font-bold text-white`}>
              {anchorScript[indexRef.current].squareBg}
            </Text>
          </View>
        </View>
      )}

      {!updateStarted && (
        <View className="bg-white w-full h-full flex justify-center items-center z-50 absolute top-30">
          <Button
            title="Start"
            onPress={() => {
              setUpdateStarted(true);
              speak();
            }}
          />
        </View>
      )}
      {!playVideo && (
        <LottieView
          // autoPlay
          ref={animation}
          style={styles.lottieStyles}
          source={require("../assets/robotLottieBodyOpti.json")}
        />

        // <LottieView
        //   // autoPlay
        //   ref={animation}
        //   style={styles.lottieStyles}
        //   source={require("./assets/mouthO.json")}
        // />
      )}

      {!playVideo && (
        <Text
          className=" font-semibold text-xl mb-8 px-4 py-2 z-20 absolute bottom-[20]  text-white"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        >
          {anchorScript[indexRef.current].speech}
        </Text>
      )}
      <Video
        ref={videoRef}
        // style={styles.video}
        source={videos[anchorScript[indexRef.current].videoKey]}
        // source={require("./assets/lindaCoffee.mp4")}
        //   uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        // }} // Update with your video URL
        resizeMode="cover"
        // resizeMode={ResizeMode.CONTAIN}
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => {
          handleVideoStatusUpdate(status);
        }}
        presentFullscreenPlayer={false}
        shouldPlay={playVideo}
        onFullscreenUpdate={(event) => {
          if (
            event.fullscreenUpdate ===
            Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
          ) {
            setPlayVideo(false); // Reset the video state when user exits fullscreen
          }
        }}
        showPoster={true}
        isLooping={false}
        className={` absolute ${playVideo ? "w-full h-full top-0" : "hidden"}`}
        // className={` absolute ${playVideo ? "w-full h-full top-0" : "hidden"}`}
      />

      {playVideo && (
        // <View className="w-screen bg-red-600 py-2 border-y-1 border-white items-start pl-8 justify-left absolute z-10 bottom-20 shadow-md">
        //   <Text className="text-yellow-200 text-xl font-semibold">

        //   </Text>
        // </View>

        <View className="absolute z-10 bottom-20  left-0 pointer-events-none flex-row w-full bg-white shadow">
          <View className="bg-red-600 px-1 py-1 items-center justify-center flex flex-row">
            <Ionicons name="globe-outline" size={22} color="white" />
            <Text className=" text-xl text-white shadow font-extrabold italic pr-1">
              MENN
            </Text>
          </View>
          <View className="bg-white px-1 py-1 items-center justify-center ">
            <Text className="pl-4  text-gray-700 shadow  from-semibold text-xl">
              {anchorScript[indexRef.current].bannerText}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default NewsReport;
const styles = StyleSheet.create({
  lottieStyles: {
    height: 500,
    width: 500,
    zIndex: 20,
    pointerEvents: "none",
    position: "absolute",
    bottom: 70,
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
