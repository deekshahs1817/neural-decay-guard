const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true // Arrays, Memory, Logic, Math, etc.
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ["mcq", "coding"],
    default: "mcq"
  },
  options: {
    type: [String], // Array of possible choices if mcq
    default: []
  },
  correctAnswer: {
    type: String, // Text of correct option
    required: true
  },
  explanation: {
    type: String
  },
  acceptanceRate: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  successfulAttempts: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Pre-save hook to calculate acceptance rate
problemSchema.pre('save', function() {
  if (this.totalAttempts > 0) {
    this.acceptanceRate = Math.round((this.successfulAttempts / this.totalAttempts) * 100);
  }
});

module.exports = mongoose.models.Problem || mongoose.model("Problem", problemSchema);
