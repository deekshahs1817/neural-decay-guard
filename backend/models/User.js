const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  dob: {
    type: String
  },

  mobile: {
    type: String
  },

  password: {
    type: String,
    required: true
  },

  // Dual Streaks & Activity Tracking
  streak: {
    type: Number,
    default: 0
  },
  codingStreak: {
    type: Number,
    default: 0
  },
  quizStreak: {
    type: Number,
    default: 0
  },
  lastCodingDate: {
    type: String,
    default: ""
  },
  lastQuizDate: {
    type: String,
    default: ""
  },

  subjects: {
    type: [String],
    default: []
  },
  
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  
  xp: {
    type: Number,
    default: 0
  },

  level: {
    type: Number,
    default: 1
  },

  badges: {
    type: [String],
    default: []
  },

  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  masteredTopics: {
    type: [String],
    default: []
  },

  learningTopics: {
    type: [String],
    default: []
  },

  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },

  // Solved Coding Problems & Challenges
  solvedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem'
  }],

  completedChallenges: [{
    challengeDate: String,
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' },
    xpAwarded: Number,
    completedAt: { type: Date, default: Date.now }
  }],

  // 25-Set DSA Roadmap Progress
  learningPathProgress: {
    completedSets: { type: [Number], default: [] },
    currentSet: { type: Number, default: 1 },
    setScores: { type: Map, of: Number, default: {} }
  },

  // CSE Core Subjects Course Progress & Certificates
  courseProgress: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },

  certificates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseCertificate'
  }],

  // Granular Topic Mastery (0 - 100%) for Decay Engine
  topicMastery: {
    type: Map,
    of: Number,
    default: {}
  }
  
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;