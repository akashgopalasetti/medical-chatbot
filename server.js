const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Dynamic port for Railway

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static frontend files if index.html is in root
app.use(express.static("."));

// ✅ Gemini API setup (make sure GEMINI_API_KEY is set in Railway Variables)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Sample route (you can modify this as per your chatbot logic)
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
