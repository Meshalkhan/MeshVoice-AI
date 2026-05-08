import { Router } from "express";
import multer from "multer";
import { generateAssistantReply } from "../services/gpt.js";
import { synthesizeSpeech } from "../services/tts.js";
import { transcribeAudio } from "../services/whisper.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 }
});

router.post("/process", upload.single("audio"), async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: "Audio file is required." });
    }

    const transcript = await transcribeAudio(req.file.buffer);
    if (!transcript) {
      return res.status(422).json({ error: "Could not transcribe audio input." });
    }

    const replyText = await generateAssistantReply(transcript);
    const speechBuffer = await synthesizeSpeech(replyText);

    return res.json({
      transcript,
      replyText,
      audioBase64: speechBuffer.toString("base64"),
      mimeType: "audio/mpeg"
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
