// Save this file as test-gemini.js
// Run with: node test-gemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your Gemini API key
const API_KEY = "AIzaSyDubuaMO2Ze49k5pNa-WXmyN4rBKgjXEPk";

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Use Gemini 1.5 Flash (fast & free tier model)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Hello Gemini, just say 'API working ✅' if you are active.";

    const result = await model.generateContent(prompt);

    console.log("Gemini API Response:");
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
