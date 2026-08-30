const Submission = require("../models/Submission");
const QuizAttempt = require("../models/QuizAttempt");
const CodingSubmission = require("../models/CodingSubmission");
const User = require("../models/User");

// 1. Get Unified Real-Time Analytics & Authentic Daily Activity Map
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Query all real user quiz attempts & submissions
    const [attempts, quizAttempts] = await Promise.all([
      Submission.find({ $or: [{ userId }, { user: userId }] }).lean(),
      QuizAttempt.find({ userId }).lean()
    ]);

    const totalQuiz = attempts.length + quizAttempts.length;
    const correctAttempts = attempts.filter(a => a.status === "Accepted").length + quizAttempts.filter(q => q.score >= 3).length;
    const accuracy = totalQuiz > 0 ? Math.round((correctAttempts / totalQuiz) * 100) : 100;

    // Parse client timezone offset (in minutes) and client local date string
    const tzOffsetMinutes = typeof req.query.tzOffset !== "undefined" ? parseInt(req.query.tzOffset, 10) : -330; // Default to IST (-330) if unset
    const clientTodayStr = req.query.clientDate || new Date(Date.now() - (tzOffsetMinutes * 60000)).toISOString().split("T")[0];

    // LeetCode Solved Count strictly from Calendar Checks
    const solvedCodingCount = user.completedChallenges?.length || 0;

    // Build authentic Date -> Activity Count dictionary across all platform activities
    const dailyActivityMap = {};
    const dailyBreakdownMap = {};
    let totalRealSubmissions = 0;

    const toClientDateStr = (dateObj) => {
      if (!dateObj) return clientTodayStr;
      if (typeof dateObj === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateObj)) {
        return dateObj;
      }
      const d = new Date(dateObj);
      if (isNaN(d.getTime())) return clientTodayStr;
      const adjusted = new Date(d.getTime() - (tzOffsetMinutes * 60000));
      return adjusted.toISOString().split("T")[0];
    };

    const recordCategoryActivity = (dateObj, category, weight = 1) => {
      if (!dateObj || weight <= 0) return;
      const dateStr = toClientDateStr(dateObj);
      dailyActivityMap[dateStr] = (dailyActivityMap[dateStr] || 0) + weight;
      totalRealSubmissions += weight;

      if (!dailyBreakdownMap[dateStr]) {
        dailyBreakdownMap[dateStr] = { quizzes: 0, challenges: 0, courses: 0, dsa: 0, total: 0, xp: 0 };
      }
      dailyBreakdownMap[dateStr][category] = (dailyBreakdownMap[dateStr][category] || 0) + weight;
      dailyBreakdownMap[dateStr].total = (dailyBreakdownMap[dateStr].total || 0) + weight;
      dailyBreakdownMap[dateStr].xp = dailyBreakdownMap[dateStr].total * 25;
    };

    // 1. Ingest Quiz Submissions (Submission model)
    attempts.forEach(sub => {
      recordCategoryActivity(sub.createdAt || clientTodayStr, 'quizzes', 1);
    });

    // 2. Ingest Daily Retention Quiz Attempts (QuizAttempt model)
    quizAttempts.forEach(qa => {
      recordCategoryActivity(qa.createdAt || clientTodayStr, 'quizzes', 1);
    });

    // 3. Ingest LeetCode Calendar Checks (user.completedChallenges)
    if (user.completedChallenges && Array.isArray(user.completedChallenges)) {
      user.completedChallenges.forEach(cc => {
        recordCategoryActivity(cc.completedAt || cc.challengeDate || clientTodayStr, 'challenges', 1);
      });
    }

    // 4. Ingest CSE Core Academy Course Sets Progress
    if (user.courseProgress) {
      for (const [_, pData] of Object.entries(user.courseProgress)) {
        if (pData && pData.completedSets && pData.completedSets.length > 0) {
          recordCategoryActivity(pData.lastUpdated || user.updatedAt || clientTodayStr, 'courses', pData.completedSets.length);
        }
      }
    }

    // 5. Ingest DSA Learning Path Sets Progress
    if (user.learningPathProgress && user.learningPathProgress.completedSets && user.learningPathProgress.completedSets.length > 0) {
      recordCategoryActivity(user.learningPathProgress.lastUpdated || user.updatedAt || clientTodayStr, 'courses', user.learningPathProgress.completedSets.length);
    }

    // 6. Ingest Direct User Daily Activity Map if present
    if (user.dailyActivityMap) {
      const mapEntries = user.dailyActivityMap instanceof Map ? Array.from(user.dailyActivityMap.entries()) : Object.entries(user.dailyActivityMap);
      mapEntries.forEach(([dKey, count]) => {
        if (typeof count === "number" && count > 0) {
          const currentRecorded = dailyActivityMap[dKey] || 0;
          if (count > currentRecorded) {
            recordCategoryActivity(dKey, 'quizzes', count - currentRecorded);
          }
        }
      });
    }

    // 7. Ingest Direct User Daily Breakdown Map if present
    if (user.dailyBreakdownMap) {
      const bdEntries = user.dailyBreakdownMap instanceof Map ? Array.from(user.dailyBreakdownMap.entries()) : Object.entries(user.dailyBreakdownMap);
      bdEntries.forEach(([dKey, bd]) => {
        if (bd && typeof bd === "object") {
          if (!dailyBreakdownMap[dKey]) {
            dailyBreakdownMap[dKey] = { quizzes: 0, challenges: 0, courses: 0, dsa: 0, total: 0, xp: 0 };
          }
          dailyBreakdownMap[dKey].quizzes = Math.max(dailyBreakdownMap[dKey].quizzes || 0, bd.quizzes || 0);
          dailyBreakdownMap[dKey].challenges = Math.max(dailyBreakdownMap[dKey].challenges || 0, bd.challenges || 0);
          dailyBreakdownMap[dKey].courses = Math.max(dailyBreakdownMap[dKey].courses || 0, (bd.courses || 0) + (bd.dsa || 0));
          const totalFromBd = dailyBreakdownMap[dKey].quizzes + dailyBreakdownMap[dKey].challenges + dailyBreakdownMap[dKey].courses;
          dailyBreakdownMap[dKey].total = Math.max(dailyBreakdownMap[dKey].total || 0, totalFromBd, bd.total || 0);
          dailyBreakdownMap[dKey].xp = Math.max(dailyBreakdownMap[dKey].xp || 0, dailyBreakdownMap[dKey].total * 25, bd.xp || 0);
          dailyActivityMap[dKey] = Math.max(dailyActivityMap[dKey] || 0, dailyBreakdownMap[dKey].total);
        }
      });
    }

    // Always ensure clientTodayStr reflects active session if user has XP or activity
    if (!dailyActivityMap[clientTodayStr] && (user.xp > 0 || totalRealSubmissions > 0)) {
      const fallbackActivity = Math.max(1, totalRealSubmissions || 1);
      recordCategoryActivity(clientTodayStr, 'quizzes', fallbackActivity);
    }

    // Calculate Active Days & Streak
    const activeDates = Object.keys(dailyActivityMap).sort();
    const totalActiveDays = activeDates.length;

    // 120-Day Heatmap array for legacy components
    const heatmapData = new Array(120).fill(0);
    const today = new Date();
    activeDates.forEach(dateStr => {
      const subDate = new Date(dateStr);
      const diffDays = Math.floor((today - subDate) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 120) {
        heatmapData[119 - diffDays] = dailyActivityMap[dateStr];
      }
    });

    // Calculate Retention Score based on activity recency
    const daysSinceActive = activeDates.length > 0
      ? Math.max(0, Math.floor((today - new Date(activeDates[activeDates.length - 1])) / (1000 * 60 * 60 * 24)))
      : 0;
    const retentionScore = Math.max(40, Math.round(100 * Math.exp(-0.05 * daysSinceActive)));

    // Strict Daily Retention Quiz Streak Calculation
    let activeStreak = 0;
    if (user.lastQuizDate) {
      const curDate = new Date(clientTodayStr + "T00:00:00");
      const lastDate = new Date(user.lastQuizDate + "T00:00:00");
      const diffDays = Math.round((curDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Solved today -> streak is active
        activeStreak = user.quizStreak || user.streak || 1;
      } else if (diffDays === 1) {
        // Solved yesterday, waiting for today's quiz
        activeStreak = user.quizStreak || user.streak || 1;
      } else {
        // Missed more than 1 day -> streak drops to 0!
        activeStreak = 0;
      }
    } else {
      activeStreak = 0;
    }

    res.json({
      name: user.name,
      email: user.email,
      totalQuiz,
      accuracy,
      streak: activeStreak,
      codingStreak: activeStreak,
      quizStreak: activeStreak,
      solvedCodingCount,
      xp: user.xp || 0,
      level: user.level || 1,
      badges: user.badges || [],
      retentionScore,
      masteredTopics: user.masteredTopics || [],
      learningTopics: user.learningTopics || [],
      dailyActivityMap,
      dailyBreakdownMap,
      totalRealSubmissions,
      totalActiveDays,
      heatmapData,
      learningPathProgress: user.learningPathProgress || { completedSets: [], currentSet: 1 }
    });

  } catch (error) {
    console.error("getUserStats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Update Knowledge Profile Matrix
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { masteredTopics, learningTopics } = req.body;

    const user = await User.findByIdAndUpdate(
      userId, 
      { masteredTopics, learningTopics }, 
      { new: true }
    );

    res.json({ message: "Identity Profile Synchronized", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to sync profile" });
  }
};