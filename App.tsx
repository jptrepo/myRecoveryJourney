import React, { useState, useEffect } from "react";
import AudioRecorder from "./components/audio/AudioRecorder";
import { StyleSheet, Button, Text, View, TouchableOpacity } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <AudioRecorder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
