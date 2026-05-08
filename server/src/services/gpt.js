import { env } from "../config/env.js";
import { openai } from "./openaiClient.js";

const SYSTEM_PROMPT =
  "You are MeshVoice AI, a concise and helpful voice assistant. Give clear, practical answers suitable for speech playback.";

export async function generateAssistantReply(userText) {
  const response = await openai.responses.create({
    model: env.openAiModel,
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userText }
    ],
    max_output_tokens: 220
  });

  return response.output_text?.trim() || "I processed your request, but could not generate a full response.";
}
