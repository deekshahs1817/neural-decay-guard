const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    default: "Global Neural Network"
  },
  description: {
    type: String
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  specialization: {
    type: String,
    enum: ['Logic', 'Memory', 'Speed', 'Attention', 'Problem Solving', 'General'],
    default: 'General'
  },
  performanceHistory: [{
    date: { type: Date, default: Date.now },
    avgScore: Number,
    totalXP: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);
