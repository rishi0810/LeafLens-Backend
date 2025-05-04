import multer from "multer";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import query from "../util/query.js";

dotenv.config();

const router = express.Router();
router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelText = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

const generationConfigText = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,

  responseMimeType: "application/json",
};

router.post("/compare", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded." });
  }

  try {
    const imageBuffer = req.file.buffer;

    const analysisResults = await query(imageBuffer);

    if (!analysisResults || analysisResults.length === 0) {
      return res
        .status(404)
        .json({ message: "Could not analyze image or no results found." });
    }

    const highest = analysisResults.reduce(
      (max, curr) => (curr.score > max.score ? curr : max),
      analysisResults[0]
    );

    const prompt = `
    Provide detailed information about the plant disease "${highest.label}".
    Return the response STRICTLY and ONLY as a valid JSON object.
    Do NOT include any introductory text, explanations, comments, or markdown formatting like \\\json ... \\\.
    The JSON object must follow this exact structure:
    {
      "disease": "String (Name of the disease)",
      "pathogen": "String (Scientific name of the pathogen, if applicable, otherwise 'N/A')",
      "symptoms": ["String (List of key symptoms)"],
      "common_regions": ["String (List of regions where it's commonly found)"],
      "spread": ["String (How the disease spreads)"],
      "conditions": ["String (Favorable environmental conditions for the disease)"],
      "trivia": ["String (Interesting facts or key identifiers)"]
    }
    Ensure all string values are properly escaped within the JSON.
    Information must be accurate and concise, focusing on major points.
    `;

    const chatSession = modelText.startChat({
      generationConfig: generationConfigText,
    });
    const infoResult = await chatSession.sendMessage(prompt);

    let infoData = null;
    let rawText = "";

    try {
      rawText = infoResult.response.text();

      const cleanedText = rawText
        .replace(/^json\s*/, "")
        .replace(/\s*$/, "")
        .trim();

      if (cleanedText) {
        infoData = JSON.parse(cleanedText);
      } else {
        throw new Error("Received empty response text from AI.");
      }
    } catch (parseError) {
      console.error("Error processing/parsing Gemini response:", parseError);
      console.error("Raw response text from Gemini:", rawText);

      return res.status(500 || 503).json({
        message: "Failed to get valid JSON information from the AI model.",
        analysis_results: analysisResults,
        ai_error: parseError.message,
        raw_ai_response: rawText,
      });
    }

    return res.status(200).json({
      allresult: analysisResults,
      info: infoData,
    });
  } catch (err) {
    console.error("Error in /compare route:", err);

    if (err.message === "Only image files are allowed!") {
      return res.status(400).json({ message: err.message });
    }
    res
      .status(500)
      .json({
        message: err.message || "An unexpected internal server error occurred.",
      });
  }
});

export default router;
