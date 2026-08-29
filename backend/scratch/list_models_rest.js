const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      console.log("AVAILABLE MODELS:");
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("No models found or error:", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

listModels();
