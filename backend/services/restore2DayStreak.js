require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Submission = require("../models/Submission");
const QuizAttempt = require("../models/QuizAttempt");

async function restoreStreak() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for streak restoration...");

    const users = await User.find({});
    console.log(`Found ${users.length} users in database.`);

    for (const user of users) {
      user.streak = 2;
      user.quizStreak = 2;
      user.codingStreak = 2;
      user.lastQuizDate = "2026-08-30";
      user.lastCodingDate = "2026-08-30";

      // Ensure dailyActivityMap has active entries for both Aug 29 and Aug 30
      if (!user.dailyActivityMap || !(user.dailyActivityMap instanceof Map)) {
        user.dailyActivityMap = new Map();
      }
      user.dailyActivityMap.set("2026-08-29", Math.max(17, user.dailyActivityMap.get("2026-08-29") || 17));
      user.dailyActivityMap.set("2026-08-30", Math.max(5, user.dailyActivityMap.get("2026-08-30") || 5));

      // Ensure completedChallenges has entries for both days
      if (!user.completedChallenges) user.completedChallenges = [];
      if (!user.completedChallenges.some(cc => cc.challengeDate === "2026-08-29")) {
        user.completedChallenges.push({
          challengeDate: "2026-08-29",
          xpAwarded: 50,
          completedAt: new Date("2026-08-29T12:00:00.000Z")
        });
      }
      if (!user.completedChallenges.some(cc => cc.challengeDate === "2026-08-30")) {
        user.completedChallenges.push({
          challengeDate: "2026-08-30",
          xpAwarded: 50,
          completedAt: new Date("2026-08-30T10:00:00.000Z")
        });
      }

      if (!user.xp || user.xp < 425) {
        user.xp = 425;
      }
      user.level = Math.floor(user.xp / 100) + 1;

      await user.save();
      console.log(`Restored User ${user.email || user.name}: Streak=2 Days (Aug 29 & Aug 30 active).`);
    }

    console.log("==========================================");
    console.log("🔥 SUCCESS: 2-DAY STREAK (AUG 29 & 30) RESTORED!");
    console.log("==========================================");
    process.exit(0);
  } catch (err) {
    console.error("Streak restore error:", err);
    process.exit(1);
  }
}

restoreStreak();
