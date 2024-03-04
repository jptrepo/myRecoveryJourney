import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Audio } from "expo-av";

const AudioPlayerButton = ({ uri }: { uri: string }) => {
  const playRecording = async () => {
    try {
      if (uri) {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: uri.toString() });
        await sound.playAsync();
      }
    } catch (error) {
      console.error("error playing audio", error);
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
