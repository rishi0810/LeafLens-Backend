import dotenv from "dotenv"
dotenv.config();

const hfkey = process.env.HF_INFERENCE_KEY;
async function query(imageBuffer) {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/Diginsa/Plant-Disease-Detection-Project",
      {
        headers: {
          Authorization: `Bearer ${hfkey} `, 
          "Content-Type": "image/jpeg",
        },
        method: "POST",
        body: imageBuffer, 
      }
    );
    
    const result = await response.json();
    return result;
  }

  export default query