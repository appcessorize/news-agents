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
import ButtonIconLeft from "../components/ButtonIconLeft";
import Ready from "../components/NewsReport/Ready";
const videos = {
  newsintro: require("../assets/videos/MENNintroLow.mp4"),
  hugoSleeping: require("../assets/videos/hugoSleeping.mp4"),
  mennIntro: require("../assets/videos/MENNintroWithMusic.mp4"),
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
    // {
    //   videoKey: "mennIntro",
    //   bannerText: "Rainy weather tomorrow, with mild temperatures.",
    //   speech:
    //     "Moderate rain is expected tomorrow. The minimum temperature will be 8.9 degrees Celsius, with a maximum of 11 degrees Celsius.",
    //   squareBg: "Rainy",
    //   squareBgEmoji: "🌧️",
    // },
    // {
    //   speech:
    //     "Welcome to me news network news. a.i genrated personalized news made with your friends and family",
    //   videoKey: "mennIntro",
    //   squareBg: "NEWS",
    //   squareBgEmoji: "📰",
    //   bannerText: "Welcome to the news",
    // },
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
  const [introPassed, setIntroPassed] = useState(false);
  const indexRef = useRef(0);
  const volumeRef = useRef(0);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [updateStarted, setUpdateStarted] = useState(false);
  const [hideStartScreen, setHideStartScreen] = useState(false);
  const [volume, setVolume] = useState(0);
  const [sound, setSound] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  useEffect(() => {
    if (isPlaying) {
      animation.current.play();
    } else {
      animation.current.reset();
    }
  }, [isPlaying]);

  // native tts

  const onTtsdone = () => {
    // animation.current.reset();
    // videoRef.current.playAsync();
    animation.current.reset();

    console.log("volume", volume);
    setPlayVideo(true);
  };

  const speak = () => {
    console.log("speak");
    setVolume(0.1);
    volumeRef.current = 0.1;
    if (!musicPlaying) {
      playMusic();
    }

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
      setVolume(0);
      volumeRef.current = 0;

      videoRef.current.playAsync();
    }
  }, [playVideo]);

  const handleVideoStatusUpdate = async (status) => {
    if (status.didJustFinish && !status.isLooping) {
      if (!updateStarted) {
        //speech and then
        setUpdateStarted(true);
        setIntroPassed(true);
      }
      await videoRef.current.setPositionAsync(0); // Reset video to start
      setPlayVideo(false); // Optionally stop the video from auto-restarting
      //   setI((prevI) => prevI + 1);
      if (updateStarted) {
        indexRef.current = indexRef.current + 1;
      }

      speak();
    }
  };
  const startNewsReport = () => {
    if (introPassed) {
      setUpdateStarted(true);
      speak();
    } else {
      setPlayVideo(true);

      setHideStartScreen(true);
    }
  };

  let videoSource;
  if (introPassed) {
    videoSource = videos[anchorScript[indexRef.current].videoKey];
  } else {
    videoSource = require("../assets/videos/MENNintroWithMusic.mp4");
  }
  async function playMusic() {
    console.log("Playing Sound..");
    // Make sure the MP3 file is correctly imported and the path is correct
    const audioUri = require("../assets/music/bgmusic.mp3");
    try {
      // Preloading the audio file and then playing it
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioUri, // directly use the asset reference here
        { shouldPlay: true, isLooping: true } // Optionally preload and start playing immediately
      );
      setSound(newSound);
      await sound.playAsync();
      setMusicPlaying(true); // This should already be playing if 'shouldPlay' is true
    } catch (error) {
      console.log("Error loading or playing audio:", error);
    }
  }
  useEffect(() => {
    console.log("useeffectvolume", volume);
    if (sound) {
      if (playVideo) {
        sound.setVolumeAsync(0).catch((error) => {
          console.log("Error setting volume:", error);
        });
      } else {
        sound.setVolumeAsync(0.1).catch((error) => {
          console.log("Error setting volume:", error);
        });
      }
      //   sound.setVolumeAsync(volumeRef.current).catch((error) => {
      //     console.log("Error setting volume:", error);
      //   });
    }
  }, [volume, sound, volumeRef.current]);

  useEffect(() => {
    console.log(
      "indexref",
      indexRef.current,
      anchorScript[indexRef.current].speech,
      anchorScript[indexRef.current].bannerText,
      anchorScript[indexRef.current].videoKey,
      anchorScript[indexRef.current].squareBg,
      anchorScript[indexRef.current].squareBgEmoji
    );
  }, [indexRef.current]);

  return (
    <View className="w-full h-full bg-blue-50 flex items-center justify-end">
      <Image
        source={require("../assets/newsBgEdited.jpeg")}
        className="w-full h-full absolute top-0 left-0"
      />
      {!introPassed && (
        <View className="absolute z-10 top-[50] right-0 pointer-events-none flex-row  bg-red-600 shadow">
          <View className="bg-red-600 px-1 py-1 items-center justify-center flex flex-row">
            <Text className="text-3xl text-white shadow font-extrabold italic pr-1">
              NIGHTLY NEWS
            </Text>
          </View>
        </View>
      )}
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
      {!hideStartScreen && <Ready startNewsReport={startNewsReport} />}
      {!playVideo && (
        <LottieView
          // autoPlay
          ref={animation}
          style={styles.lottieStyles}
          source={require("../assets/robotLottieBodyOpti.json")}
        />
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
        // source={videoSource}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/treeswap-wales.appspot.com/o/videos%2Fi1FDwSVr0bSqofiO7CXEtmKPhUn1%2F1714653181841?alt=media",
        }}
        resizeMode="cover"
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
      />

      {!introPassed && (
        <View className="absolute z-10 bottom-20  left-0 pointer-events-none flex-row w-full bg-white shadow">
          <View className="bg-red-600 px-1 py-1 items-center justify-center flex flex-row">
            <Ionicons name="globe-outline" size={22} color="white" />
            <Text className=" text-xl text-white shadow font-extrabold italic pr-1">
              MENN
            </Text>
          </View>
          <View className="bg-white px-1 py-1 items-center justify-center ">
            <Text className="pl-4  text-gray-700 shadow  from-semibold text-xl">
              Welcome to the news
            </Text>
          </View>
        </View>
      )}
      {playVideo && introPassed && (
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
