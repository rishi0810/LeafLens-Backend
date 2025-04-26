import multer from "multer";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import query from "../util/query.js";

dotenv.config();

const router = express.Router();
router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelText = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
});

const generationConfigText = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: ["text"],
  responseMimeType: "text/plain",
};

router.post("/compare", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
   
    const result = await query(imageBuffer);
   
    const highest = result.reduce((max, curr) =>
      curr.score > max.score ? curr : max
    );

    const prompt = `Explain about ${highest.label} in major points. Shorten each point into 2 subpoints and keep the material concise and containing info about causes and general trivia. Total word should not be more than 100.`;

    const chatSession = modelText.startChat({ generationConfigText });
    const inforesult = await chatSession.sendMessage(prompt);
    const candidates = inforesult.response.candidates;

    const outputs = candidates.flatMap((candidate) =>
      candidate.content.parts.map((part) => {
        return {
          type: "text",
          data: part.text || "",
        };
      })
    );

    return res.status(200).json({ allresult: result, info: outputs[0].data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

export default router;
