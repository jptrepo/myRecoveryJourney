import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Audio } from "expo-av";

const AudioPlayerButton = ({ uri }: { uri: string }) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const playRecording = async () => {
    if (playing) return; // If already playing, return immediately
    setPlaying(true); // Set playing to true when starting to play
    try {
      if (uri) {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: uri.toString() });
        await sound.playAsync();
      }
    } catch (error) {
      console.error("error playing audio", error);
    } finally {
      setPlaying(false); // Set playing to false when finished playing
    }
  };

  return (
    <View>
      <FontAwesome.Button
        name="play"
        backgroundColor="#cc0033"
        onPress={playRecording}
      >
        Play audio
      </FontAwesome.Button>
    </View>
  );
};

export default AudioPlayerButton;

const styles = StyleSheet.create({});
