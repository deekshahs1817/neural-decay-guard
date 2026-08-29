const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["mcq", "output_prediction", "complexity_analysis", "debugging", "concept"],
    default: "mcq"
  },
  codeSnippet: { type: String, default: "" },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true }
}, { _id: true });

const dsaSetSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true, unique: true, index: true }, // 1 to 25
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  description: { type: String, required: true },
  
  // Detailed Concept Theory & Code Walkthrough
  conceptGuide: {
    overview: { type: String, required: true },
    keyPatterns: { type: [String], default: [] },
    timeSpaceRules: { type: String, default: "" },
    visualExplanation: { type: String, default: "" },
    codeExample: { type: String, default: "" }
  },
  
  // 5 Quiz Questions per set (Total 25 sets * 5 = 125 Questions)
  quizQuestions: { type: [quizQuestionSchema], default: [] },
  
  // Practice Coding Exercises references
  practiceExercises: [{
    title: String,
    difficulty: String,
    description: String,
    starterSnippet: String
  }],

  xpReward: { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.models.DSALearningPath || mongoose.model("DSALearningPath", dsaSetSchema);
