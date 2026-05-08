import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import voiceRoutes from "./routes/voice.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "meshvoice-ai-server" });
});

app.use("/api/voice", voiceRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: "Internal server error",
    message: error?.message || "Unexpected error"
  });
});

export default app;
