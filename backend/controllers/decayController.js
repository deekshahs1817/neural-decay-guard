const User = require("../models/User");
const CodingSubmission = require("../models/CodingSubmission");
const Submission = require("../models/Submission");
const CoreSubjectCourse = require("../models/CoreSubjectCourse");
const DSALearningPath = require("../models/DSALearningPath");

// Calculate real Ebbinghaus Retention Decay across all user learning streams
exports.getDecayPrediction = async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const topicActivity = new Map(); // topicName -> { lastActive: Date, totalInteractions: number, category: string }

    const recordTopicActivity = (topic, date, category = "General") => {
      if (!topic || topic === "Unknown") return;
      const existing = topicActivity.get(topic);
      const activityDate = new Date(date || now);
      if (!existing) {
        topicActivity.set(topic, {
          lastActive: activityDate,
          totalInteractions: 1,
          category
        });
      } else {
        if (activityDate > existing.lastActive) {
          existing.lastActive = activityDate;
        }
        existing.totalInteractions += 1;
      }
    };

    // 1. Ingest Coding Arena & Daily Challenge Submissions
    const codingSubs = await CodingSubmission.find({ user: userId })
      .populate("problem", "title category difficulty")
      .lean();

    codingSubs.forEach(sub => {
      if (sub.problem && sub.problem.category) {
        recordTopicActivity(sub.problem.category, sub.createdAt, "DSA & Algorithms");
      }
    });

    // 2. Ingest CSE Core Academy Course Progress
    if (user.courseProgress) {
      const courses = await CoreSubjectCourse.find().select("courseId title").lean();
      const courseMap = new Map(courses.map(c => [c.courseId, c.title]));

      for (const [courseId, pData] of Object.entries(user.courseProgress)) {
        const title = courseMap.get(courseId) || courseId.toUpperCase();
        if (pData.completedSets && pData.completedSets.length > 0) {
          recordTopicActivity(title, pData.lastUpdated || user.updatedAt || now, "CSE Core");
        }
      }
    }

    // 3. Ingest DSA Roadmap Progress
    if (user.learningPathProgress && user.learningPathProgress.completedSets) {
      const dsaSets = await DSALearningPath.find({
        setNumber: { $in: user.learningPathProgress.completedSets }
      }).select("category").lean();

      dsaSets.forEach(s => {
        recordTopicActivity(s.category, user.updatedAt || now, "DSA & Algorithms");
      });
    }

    // 4. Ingest Knowledge Profile (Mastered & Learning Topics)
    if (user.masteredTopics && user.masteredTopics.length > 0) {
      user.masteredTopics.forEach(t => {
        if (!topicActivity.has(t)) {
          // If in mastered topics, default to recent activity (e.g. 1 day ago)
          recordTopicActivity(t, new Date(Date.now() - 86400000), "Knowledge Profile");
        }
      });
    }

    if (user.learningTopics && user.learningTopics.length > 0) {
      user.learningTopics.forEach(t => {
        if (!topicActivity.has(t)) {
          // Learning topics show as fading (e.g. 4 days ago) to prompt revision
          recordTopicActivity(t, new Date(Date.now() - 4 * 86400000), "Knowledge Profile");
        }
      });
    }

    // Fallback baseline topics if user is brand new
    if (topicActivity.size === 0) {
      const defaultTopics = [
        { name: "Arrays & Two Pointers", cat: "DSA & Algorithms", days: 0.5 },
        { name: "Database Management Systems (DBMS)", cat: "CSE Core", days: 1 },
        { name: "Operating Systems (OS)", cat: "CSE Core", days: 3 },
        { name: "Computer Networks (CN)", cat: "CSE Core", days: 5 },
        { name: "Dynamic Programming", cat: "DSA & Algorithms", days: 8 }
      ];
      defaultTopics.forEach(dt => {
        topicActivity.set(dt.name, {
          lastActive: new Date(Date.now() - dt.days * 86400000),
          totalInteractions: 3,
          category: dt.cat
        });
      });
    }

    // Calculate Ebbinghaus Retention Score R = e^(-Δt / S) * 100
    const resultArr = [];
    for (const [subject, data] of topicActivity.entries()) {
      const diffHours = Math.max(0, (now - data.lastActive) / (1000 * 60 * 60));
      const diffDays = diffHours / 24;

      // Stability factor S increases with total interactions
      const stability = Math.max(2, 2 + data.totalInteractions * 0.8);
      const retentionScore = Math.max(15, Math.min(100, Math.round(Math.exp(-diffDays / stability) * 100)));

      let status = "Decaying";
      let statusLabel = "Needs Urgent Review";
      if (retentionScore >= 75) {
        status = "Strong";
        statusLabel = "Strongly Retained";
      } else if (retentionScore >= 50) {
        status = "Medium";
        statusLabel = "Fading Topic";
      }

      resultArr.push({
        subject,
        category: data.category,
        status,
        statusLabel,
        retentionScore,
        lastActive: data.lastActive,
        daysSinceLastReview: Number(diffDays.toFixed(1)),
        totalInteractions: data.totalInteractions
      });
    }

    // Sort by retentionScore ascending (most decaying first)
    resultArr.sort((a, b) => a.retentionScore - b.retentionScore);

    const counts = {
      strong: resultArr.filter(r => r.status === "Strong").length,
      medium: resultArr.filter(r => r.status === "Medium").length,
      decaying: resultArr.filter(r => r.status === "Decaying").length
    };

    res.json({
      subjects: resultArr,
      counts,
      overallRetentionAverage: Math.round(resultArr.reduce((acc, r) => acc + r.retentionScore, 0) / (resultArr.length || 1)),
      lastCalculated: now
    });
  } catch (error) {
    console.error("Decay prediction error:", error);
    res.status(500).json({ message: error.message });
  }
};