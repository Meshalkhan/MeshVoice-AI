import { env } from "../config/env.js";

export async function synthesizeSpeech(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${env.elevenLabsVoiceId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": env.elevenLabsApiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg"
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`TTS request failed: ${message}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
