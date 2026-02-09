import dotenv from "dotenv";
import { FormData, Blob } from "node-fetch";

dotenv.config();

async function query(imageBuffer) {
  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const formData = new FormData();
      const blob = new Blob([imageBuffer], { type: "image/jpeg" });
      formData.append("file", blob, "image.jpg");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(process.env.INFERENCE_URL, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.predictions && Array.isArray(result.predictions)) {
        return result.predictions
          .map((pred) => ({
            label: pred.label,
            score: pred.confidence,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
      }

      return result;
    } catch (err) {
      console.error(`Attempt ${attempt + 1} failed:`, err.message);
      attempt++;

      if (attempt >= MAX_RETRIES) {
        throw new Error(`Failed after ${MAX_RETRIES} attempts: ${err.message}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

export default query;
