import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const hfkey = process.env.HF_INFERENCE_KEY;

async function query(imageBuffer) {
  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await axios.post(
        "https://router.huggingface.co/hf-inference/models/Diginsa/Plant-Disease-Detection-Project",
        imageBuffer,
        {
          headers: {
            Authorization: `Bearer ${hfkey}`,
            "Content-Type": "image/jpeg",
          },
          responseType: "json",
        }
      );

      return response.data;
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
