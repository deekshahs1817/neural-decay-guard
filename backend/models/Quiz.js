const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  subject: String,
  level: String, // Beginner / Intermediate / Advanced
  question: String,
  options: [String],
  answer: String
});

module.exports = mongoose.model("Quiz", quizSchema);