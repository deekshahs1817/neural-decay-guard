require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Submission = require("../models/Submission");
const QuizAttempt = require("../models/QuizAttempt");
const CodingSubmission = require("../models/CodingSubmission");
const { seedDSAData } = require("./dsaSeedData");
const { seedCoreSubjects } = require("./coreSubjectsSeed");

async function resetAllDataStartingToday() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for clean slate initialization...");

    // 1. Reset all users' streaks, progression, and historical activity
    const updateRes = await User.updateMany({}, {
      $set: {
        streak: 0,
        quizStreak: 0,
        codingStreak: 0,
        lastQuizDate: null,
        completedChallenges: [],
        dailyActivityMap: {},
        courseProgress: {},
        learningPathProgress: { completedSets: [], currentSet: 1 },
        xp: 0,
        level: 1,
        badges: ["First Step"],
        solvedProblems: []
      }
    });
    console.log(`[Clean Slate] Reset ${updateRes.modifiedCount || updateRes.matchedCount} user profiles to start fresh from today.`);

    // 2. Clear old submission logs
    await Promise.all([
      Submission.deleteMany({}),
      QuizAttempt.deleteMany({}),
      CodingSubmission.deleteMany({})
    ]);
    console.log("[Clean Slate] Cleared all historical submission logs & quiz attempts.");

    // 3. Ensure curriculum and canonical datasets are properly seeded
    await seedDSAData();
    await seedCoreSubjects();

    console.log("=================================================");
    console.log("🚀 ALL TELEMETRY & STATS RESET TO START FRESH TODAY!");
    console.log("=================================================");
    process.exit(0);
  } catch (err) {
    console.error("Error resetting data:", err);
    process.exit(1);
  }
}

resetAllDataStartingToday();
