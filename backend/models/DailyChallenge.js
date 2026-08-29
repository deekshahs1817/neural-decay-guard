const mongoose = require("mongoose");

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true, index: true }, // YYYY-MM-DD
  dayOfWeek: { type: String, required: true }, // Monday, Tuesday, etc.
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "CodingProblem", required: true },
  xpReward: { type: Number, default: 20 },
  completions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    completedAt: { type: Date, default: Date.now },
    runtimeMs: Number,
    memoryMb: Number,
    language: String
  }]
}, { timestamps: true });

module.exports = mongoose.models.DailyChallenge || mongoose.model("DailyChallenge", dailyChallengeSchema);
