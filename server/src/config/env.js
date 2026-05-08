import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  whisperModel: process.env.WHISPER_MODEL || "whisper-1",
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || "",
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || ""
};

export function validateEnv() {
  const missing = [];

  if (!env.openAiApiKey) missing.push("OPENAI_API_KEY");
  if (!env.elevenLabsApiKey) missing.push("ELEVENLABS_API_KEY");
  if (!env.elevenLabsVoiceId) missing.push("ELEVENLABS_VOICE_ID");

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
