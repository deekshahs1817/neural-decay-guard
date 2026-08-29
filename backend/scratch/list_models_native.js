const https = require("https");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Fetching models with key:", apiKey ? "PRESENT" : "MISSING");

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.models) {
        console.log("AVAILABLE MODELS:");
        parsed.models.forEach(m => console.log(`- ${m.name}`));
      } else {
        console.log("No models found. Response:", data);
      }
    } catch (e) {
      console.log("Parse error:", e.message);
      console.log("Raw data:", data);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
