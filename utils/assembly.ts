// Import AssemblyAI
import { AssemblyAI } from "assemblyai";

// Create an instance of AssemblyAI with API key from environment variables
const transcriptionclient = new AssemblyAI({
  apiKey: process.env.EXPO_PUBLIC_ASSEMBLYAIKEY!,
});
const baseUrl = "https://api.assemblyai.com/v2";
const uploadUrl = `${baseUrl}/upload`;
const authheaders = {
  Authorization: process.env.EXPO_PUBLIC_ASSEMBLYAIKEY!,
  "Content-Type": "application/octet-stream",
};
const transcribeAudio = async (upload_url: string) => {
  const params = {
    audio: upload_url,
    speaker_labels: false,
  };
  try {
    const response = await transcriptionclient.transcripts.transcribe(params);
    console.log("Transcription Response:", response);
    if (response?.text) {
      return response.text;
    } else {
      throw new Error(
        `Transcription failed. Response: ${JSON.stringify(response)}`
      );
    }
  } catch (error: any) {
    console.error("error with audio transcription", error);
    throw new Error(`AssemblyAI transcription error: ${error.message}`);
  }
};
export const AssemblyAIConfig = {
  transcribeAudio,
  baseUrl,
  uploadUrl,
  authheaders,
};
