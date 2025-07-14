const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route: Generate medical advice
app.post("/medical-advice", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing patient problem description" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro" });
    const prompt = `
You are a helpful and professional medical assistant.
Given the following patient's problem description, suggest possible medical remedies or next steps they can take.
Be clear and professional, and remind them to see a doctor for severe or persistent symptoms.
Patient's description: ${text}
    `;
    const result = await model.generateContent(prompt);
    const advice = result.response.text();
    res.json({ advice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate medical advice" });
  }
});

// Route: Serve frontend HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index2.html"));
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
