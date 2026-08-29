const mongoose = require("mongoose");

const codingSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "CodingProblem", required: true, index: true },
  language: { type: String, enum: ["c", "cpp", "java", "python", "javascript"], required: true },
  code: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Memory Limit Exceeded", "Runtime Error", "Compilation Error"],
    required: true,
    default: "Accepted"
  },
  
  passCount: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 15 },
  passPercentage: { type: Number, default: 0 },
  
  basicPassed: { type: Number, default: 0 },
  basicTotal: { type: Number, default: 3 },
  
  mediumPassed: { type: Number, default: 0 },
  mediumTotal: { type: Number, default: 5 },
  
  hardPassed: { type: Number, default: 0 },
  hardTotal: { type: Number, default: 7 },
  
  runtimeMs: { type: Number, default: 0 },
  memoryMb: { type: Number, default: 0 },
  
  xpEarned: { type: Number, default: 0 },
  isDailyChallenge: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.CodingSubmission || mongoose.model("CodingSubmission", codingSubmissionSchema);
