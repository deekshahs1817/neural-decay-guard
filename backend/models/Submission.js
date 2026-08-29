const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer"],
    required: true
  },
  submittedAnswer: {
    type: String,
    required: true
  },
  timeSpentSecs: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
