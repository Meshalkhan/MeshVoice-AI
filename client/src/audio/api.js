const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function processVoiceAudio(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch(`${API_BASE}/api/voice/process`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Voice processing failed");
  }

  return response.json();
}
