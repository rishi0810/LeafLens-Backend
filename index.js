import express from "express";
import { config } from "dotenv";
import cors from "cors";
config();
import Genrouter from "./route/generate.js";
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: ["https://leaf-lens-ai.vercel.app", "http://localhost:5173"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use("/generate", Genrouter);
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Get request initialized" });
});

app.listen(port, () => {
  console.log("Listening on port:", port);
});
