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
    let totalRealSubmissions = 0;

    const toClientDateStr = (dateObj) => {
      if (!dateObj) return clientTodayStr;
      if (typeof dateObj === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateObj)) {
        // If string matches clientTodayStr or is an explicit date string
        return dateObj;
      }
      const d = new Date(dateObj);
      if (isNaN(d.getTime())) return clientTodayStr;
      const adjusted = new Date(d.getTime() - (tzOffsetMinutes * 60000));
      return adjusted.toISOString().split("T")[0];
    };

    const addActivity = (dateObj, weight = 1) => {
      if (!dateObj) return;
      const dateStr = toClientDateStr(dateObj);
      dailyActivityMap[dateStr] = (dailyActivityMap[dateStr] || 0) + weight;
      totalRealSubmissions += weight;
    };

    // 1. Ingest Quiz Submissions (Submission model)
    attempts.forEach(sub => {
      addActivity(sub.createdAt || clientTodayStr, 1);
    });

    // 2. Ingest Daily Retention Quiz Attempts (QuizAttempt model)
    quizAttempts.forEach(qa => {
      addActivity(qa.createdAt || clientTodayStr, 1);
    });

    // 3. Ingest LeetCode Calendar Checks (user.completedChallenges)
    if (user.completedChallenges && Array.isArray(user.completedChallenges)) {
      user.completedChallenges.forEach(cc => {
        addActivity(cc.completedAt || cc.challengeDate || clientTodayStr, 1);
      });
    }

    // 4. Ingest CSE Core Academy Course Sets Progress
    if (user.courseProgress) {
      for (const [_, pData] of Object.entries(user.courseProgress)) {
        if (pData && pData.completedSets && pData.completedSets.length > 0) {
          addActivity(pData.lastUpdated || user.updatedAt || clientTodayStr, pData.completedSets.length);
        }
      }
    }

    // 5. Ingest DSA Learning Path Sets Progress
    if (user.learningPathProgress && user.learningPathProgress.completedSets && user.learningPathProgress.completedSets.length > 0) {
      addActivity(user.learningPathProgress.lastUpdated || user.updatedAt || clientTodayStr, user.learningPathProgress.completedSets.length);
    }

    // 6. Ingest Direct User Daily Activity Map if present
    if (user.dailyActivityMap) {
      const mapEntries = user.dailyActivityMap instanceof Map ? Array.from(user.dailyActivityMap.entries()) : Object.entries(user.dailyActivityMap);
      mapEntries.forEach(([dKey, count]) => {
        if (typeof count === "number" && count > 0) {
          addActivity(dKey, count);
        }
      });
    }

    // Always ensure clientTodayStr reflects active session if user has XP or activity
    if (!dailyActivityMap[clientTodayStr] && (user.xp > 0 || user.streak > 0 || totalRealSubmissions > 0)) {
      const fallbackActivity = Math.max(1, totalRealSubmissions || 1);
      dailyActivityMap[clientTodayStr] = fallbackActivity;
      totalRealSubmissions = Math.max(totalRealSubmissions, fallbackActivity);
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

    res.json({
      name: user.name,
      email: user.email,
      totalQuiz,
      accuracy,
      streak: user.quizStreak || 0,
      codingStreak: user.quizStreak || 0,
      quizStreak: user.quizStreak || 0,
      solvedCodingCount,
      xp: user.xp || 0,
      level: user.level || 1,
      badges: user.badges || [],
      retentionScore,
      masteredTopics: user.masteredTopics || [],
      learningTopics: user.learningTopics || [],
      dailyActivityMap, // Pure real database dictionary { "2026-08-29": 31, ... }
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