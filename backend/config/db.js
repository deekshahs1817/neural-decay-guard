const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if not permitted
}

const CLOUD_MONGO_URI = "mongodb+srv://admin:NeuralGuard2026@cluster0.m42dvgz.mongodb.net/neural_decay_guard?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || CLOUD_MONGO_URI;
    await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error with Primary URI:", error.message);
    try {
      console.log("Attempting fallback connection to MongoDB Atlas Cloud...");
      await mongoose.connect(CLOUD_MONGO_URI);
      console.log("MongoDB Connected successfully to Cloud Atlas fallback.");
    } catch (fallbackErr) {
      console.error("MongoDB Cloud Connection Failed:", fallbackErr.message);
    }
  }
};

module.exports = connectDB;