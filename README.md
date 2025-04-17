# LeafLens AI - Backend

<div align="center">
 <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
<img src = "https://img.shields.io/badge/-HuggingFace-FDEE21?style=for-the-badge&logo=HuggingFace&logoColor=black" alt = "Hugging Face"/>
<img src = "https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt = "Vercel" />
<img src = "https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" alt = "Express JS" />
<img src = "https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt = "Node JS" />
<img src = "https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt = "Google Gemini" />
</div>




---

## 🧰 Tech Stack

- **Backend Framework:** Node.js + Express  
- **File Uploads:** Multer  
- **AI Model:** [HuggingFace Inference API](https://huggingface.co/Diginsa/Plant-Disease-Detection-Project) for plant disease detection  
- **Frontend App:** [View on Vercel](https://leaf-lens-ai.vercel.app/)  

---

## 🚀 Getting Started

###  Installation

You can install dependencies using your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```
## Environment Variables
```env
PORT = your_desired_port  
GEMINI_API_KEY = YOUR_API_KEY
HF_INFERENCE_KEY = YOUR_HFBEARER_TOKEN
```

###  Run the Project

```bash
# Start server with npm
npm start

# or with yarn
yarn start

# or with pnpm
pnpm start
```

---

## 🧪 API Overview

The backend connects to HuggingFace's plant disease detection API via image uploads using **Multer**. It processes and forwards the image to the inference API, returning the prediction.

```http
POST /generate/compare
Content-Type: multipart/form-data
Body: image file
```

> Make sure to set your HuggingFace API key in your environment variables!

---

## 🔗 Related Links

- 🌐 **Frontend Vercel Deploy:** [LeafLens App](https://leaf-lens-ai.vercel.app/)  
- 🤖 **HuggingFace API Info:** [Plant Disease Model](https://huggingface.co/Diginsa/Plant-Disease-Detection-Project)

---

## 💡 Contribute

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Contact
<div >
  <a href="https://www.linkedin.com/in/rishiraj2003/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</div>

---


