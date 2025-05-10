import dotenv from "dotenv";

dotenv.config();

const hfkey = process.env.HF_INFERENCE_KEY;

async function query(imageBuffer) {
  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfkey}`,
            "Content-Type": "image/jpeg",
          },
          body: imageBuffer,
        }
      );

      const result = await response.json();
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
