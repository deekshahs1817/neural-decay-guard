const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subject: {
    type: String
  },

  score: {
    type: Number,
    required: true
  },

  totalQuestions: {
    type: Number
  },

  answers: [
    {
      question: String,
      selected: String,
      correct: String
    }
  ],

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);