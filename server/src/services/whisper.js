import { toFile } from "openai";
import { env } from "../config/env.js";
import { openai } from "./openaiClient.js";

export async function transcribeAudio(buffer) {
  const file = await toFile(buffer, "voice-input.webm", { type: "audio/webm" });
  const result = await openai.audio.transcriptions.create({
    file,
    model: env.whisperModel
  });

  return result.text?.trim() || "";
}
