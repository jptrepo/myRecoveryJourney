import React, { useState, useEffect } from "react";
import { StyleSheet, Button, Text, View, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import * as FileSystem from "expo-file-system";
import { AssemblyAIConfig } from "../utils/assembly";
import { handleResponse } from "../utils/responseHandler";

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

  const transcribe = async () => {
    if (uri) {
      try {
        setUploading(true);

        //if there is no upload for this audio
        if (!uploadedUrl) {
          const uploadresponse = await FileSystem.uploadAsync(
            AssemblyAIConfig.uploadUrl,
            uri,
            {
              httpMethod: "POST",
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              fieldName: "file",
              headers: AssemblyAIConfig.authheaders,
            }
          );
          setUploadedUrl(handleResponse(uploadresponse, "upload_url"));
        } else {
          console.log("Attempting to transcribe URL:", uploadedUrl);
          const transcriptionresponse = await AssemblyAIConfig.transcribeAudio(
            uploadedUrl
          );
          console.log(transcriptionresponse);
        }

        setUploading(false);
      } catch (error: any) {
        console.error("error with audio upload/transcription", error);
        setErrorMessage(error.message);
        setUploading(false);
      }
    } else {
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
          <TouchableOpacity onPress={playRecording}>
            <Text style={styles.linkText}>Play Recording</Text>
            <Text>{uri}</Text>
            <Button
              onPress={transcribe}
              title={
                uploading
                  ? "Transcript Uploading"
                  : errorMessage
                  ? "Error. Try again?"
                  : "Get Transcript"
              }
              disabled={uploading}
            />
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </TouchableOpacity>
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
});
