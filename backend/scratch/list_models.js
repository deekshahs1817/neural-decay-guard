const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const result = await genAI.listModels();
    console.log("AVAILABLE MODELS:");
    result.models.forEach(model => {
      console.log(`- ${model.name} (Methods: ${model.supportedMethods.join(", ")})`);
    });
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
