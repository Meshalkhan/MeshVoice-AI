import VoiceAssistant from "./components/VoiceAssistant";

export default function App() {
  return (
    <main className="app-shell">
      <div className="bg-grid" />
      <header className="hero">
        <span className="chip">MeshVoice AI</span>
        <h1>Voice-to-Action AI Assistant</h1>
        <p>
          Speak naturally. MeshVoice transcribes your audio, orchestrates GPT reasoning, and responds with
          lifelike synthesized voice.
        </p>
      </header>
      <VoiceAssistant />
    </main>
  );
}
