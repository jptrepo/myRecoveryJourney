// Import AssemblyAI
import { AssemblyAI } from "assemblyai";
import * as FileSystem from "expo-file-system";
import { handleResponse } from "../utils/responseHandler";
// Create an instance of AssemblyAI with API key from environment variables
const transcriptionclient = new AssemblyAI({
  apiKey: process.env.EXPO_PUBLIC_ASSEMBLYAIKEY!,
});
const baseUrl = "https://api.assemblyai.com/v2";
const uploadUrl = `${baseUrl}/upload`;
const authheaders = {
  Authorization: process.env.EXPO_PUBLIC_ASSEMBLYAIKEY!,
  "Content-Type": "audio/mpeg",
};

const uploadAudio = async (uri: string) => {
  try {
    const uploadresponse = await FileSystem.uploadAsync(uploadUrl, uri, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      fieldName: "file",
      headers: authheaders,
    });
    const upload_url = handleResponse(uploadresponse, "upload_url");
    console.log("returned uploadURL response", upload_url);
    return upload_url;
  } catch (error: any) {
    throw new Error(`AssemblyAI upload error: ${error.message}`);
  }
};

const transcribeAudio = async (upload_url: string) => {
  //console.log("uploadurl:", upload_url);
  const params = {
    audio: upload_url,
    speaker_labels: false,
  };
  try {
    const response = await transcriptionclient.transcripts.transcribe(params);
    console.log("Transcription Response::", response);
    if (response?.text) {
      return response.text;
    }
  } catch (error: any) {
    throw new Error(`AssemblyAI transcription error: ${error.message}`);
  }
};
export const AssemblyAIConfig = {
  transcribeAudio,
  uploadAudio,
};
