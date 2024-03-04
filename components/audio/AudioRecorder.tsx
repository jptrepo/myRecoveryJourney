import React, { useState, useEffect } from "react";
import { StyleSheet, Button, Text, View, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import { AssemblyAIConfig } from "../../utils/assembly";
import AudioPlayerButton from "./AudioPlayerButton";

const AudioRecorder = () => {
  const [recording, setRecording] = useState<Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [uri, setUri] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [transcription, setTranscription] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // This is where we will handle the audio recording and transcription

  const startRecording = async () => {
    setRecording(undefined);
    setUri("");
    setErrorMessage("");
    setTranscription("");
    setUploadedUrl("");
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("started recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    try {
      console.log("Stopping recording");
      setRecording(undefined);

      await recording?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording?.getURI() || "";
      console.log("Recording stopped and stored at", uri);
      setUri(uri);
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const transcribe = async () => {
    let uploadresponse = uploadedUrl;
    setUploading(true);
    if (uri) {
      //if there is no upload for this audio
      if (!uploadedUrl) {
        uploadresponse = await AssemblyAIConfig.uploadAudio(uri);
        setUploadedUrl(uploadresponse);
      }
      if (!transcription) {
        const transcriptionresponse = await AssemblyAIConfig.transcribeAudio(
          uploadresponse
        );
        if (transcriptionresponse) {
          setTranscription(transcriptionresponse);
        }
      } else {
        setErrorMessage("Already transcribed!");
      }

      setUploading(false);
    }
  };

  return (
    <View>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {uri && (
        <View>
          <AudioPlayerButton uri={uri} />
          <Button
            onPress={transcribe}
            title={
              uploading
                ? "Transcript Uploading"
                : errorMessage
                ? errorMessage
                : "Get Transcript"
            }
            disabled={uploading || Boolean(transcription)}
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          {transcription && (
            <Text style={styles.transcription}>{transcription}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AudioRecorder;

const styles = StyleSheet.create({
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
  },
  transcription: {
    color: "green",
  },
});
