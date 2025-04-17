import multer from "multer";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import query from "../util/query.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
router.use(express.json());
const upload = multer({ dest: "./uploads/" });

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
    const imagepath = req.file.path;
    const imagebuffer = fs.readFileSync(imagepath);
    const result = await query(imagebuffer);
    const highest = result.reduce((max, curr) =>
      curr.score > max.score ? curr : max
    );
    fs.unlinkSync(imagepath);

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
    console.log(err);
    res.status(500).json({ message: err });
  }
});

export default router;
