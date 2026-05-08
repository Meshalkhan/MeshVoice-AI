import { useEffect, useMemo, useRef, useState } from "react";
import { processVoiceAudio } from "../audio/api";

const STATUS = {
  idle: "Idle",
  recording: "Recording...",
  processing: "Processing your voice..."
};

export default function VoiceAssistant() {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioRef = useRef(null);

  const canRecord = useMemo(() => status !== "processing", [status]);
  const isRecording = status === "recording";

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setStatus("processing");
        await runVoicePipeline(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setStatus("recording");
    } catch (err) {
      setError(err.message || "Microphone permission denied.");
      setStatus("idle");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setStatus("idle");
  };

  const runVoicePipeline = async (audioBlob) => {
    try {
      const data = await processVoiceAudio(audioBlob);
      setTranscript(data.transcript || "");
      setReply(data.replyText || "");

      if (data.audioBase64) {
        const audioSrc = `data:${data.mimeType || "audio/mpeg"};base64,${data.audioBase64}`;
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(audioSrc);
        audioRef.current = audio;
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      }
    } catch (err) {
      setError(err.message || "Failed to process audio.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="assistant-card">
      <div className="orb-wrap">
        <div className={`voice-orb ${isRecording ? "recording" : ""} ${isPlaying ? "playing" : ""}`} />
      </div>

      <p className="status">{STATUS[status]}</p>

      <div className="controls">
        {!isRecording ? (
          <button className="primary-btn" onClick={startRecording} disabled={!canRecord}>
            Start Voice Input
          </button>
        ) : (
          <button className="danger-btn" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div className="output-grid">
        <section className="panel">
          <h3>Transcript</h3>
          <p>{transcript || "Your spoken input will appear here."}</p>
        </section>
        <section className="panel">
          <h3>AI Response</h3>
          <p>{reply || "AI response will appear here and play as speech."}</p>
        </section>
      </div>
    </div>
  );
}
