const CodingProblem = require("../models/CodingProblem");
const CodingSubmission = require("../models/CodingSubmission");
const DailyChallenge = require("../models/DailyChallenge");
const User = require("../models/User");
const { judgeSubmission, evaluateMultiLanguage } = require("../services/judgeEngine");
const { getProgressiveHint, analyzeCodeMistake, explainEditorial } = require("../services/aiCoachService");

// 1. Get Problems List with filters
const getProblems = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20, userId } = req.query;
    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await CodingProblem.countDocuments(query);
    const problems = await CodingProblem.find(query)
      .select("title slug difficulty category acceptanceRate tags")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Check solved status if userId provided
    let solvedSet = new Set();
    if (userId) {
      const user = await User.findById(userId).select("solvedProblems");
      if (user && user.solvedProblems) {
        solvedSet = new Set(user.solvedProblems.map(id => id.toString()));
      }
    }

    const formatted = problems.map(p => ({
      ...p,
      isSolved: solvedSet.has(p._id.toString())
    }));

    res.json({
      problems: formatted,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Get coding problems error:", error);
    res.status(500).json({ message: "Failed to fetch coding problems" });
  }
};

// 2. Get Single Problem by ID or Slug
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    let problem;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await CodingProblem.findById(id);
    } else {
      problem = await CodingProblem.findOne({ slug: id });
    }

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (error) {
    console.error("Get problem error:", error);
    res.status(500).json({ message: "Failed to load problem" });
  }
};

// 3. Dry Run Test Cases (Basic 3 visible cases)
const runTestCases = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const problem = await CodingProblem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const basicCases = problem.basicTestCases || [];
    const { getExpectedFunctionName } = require("../services/judgeEngine");
    const expectedFunctionName = getExpectedFunctionName(problem);
    const evalResult = evaluateMultiLanguage(language || "javascript", code, basicCases, expectedFunctionName, problem.title);

    res.json({
      success: true,
      runtimeMs: evalResult.runtimeMs,
      memoryMb: evalResult.memoryMb,
      results: evalResult.results,
      allPassed: evalResult.results.every(r => r.passed)
    });
  } catch (error) {
    console.error("Run test cases error:", error);
    res.status(500).json({ message: "Execution error during test run" });
  }
};

// 4. Full Submit Solution (3-Level Validation: 3 Basic + 5 Medium + 7 Hard)
const submitSolution = async (req, res) => {
  try {
    const { userId, problemId, language, code, isDailyChallenge } = req.body;

    const problem = await CodingProblem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Run Judge Engine against all 15 test cases
    const judgeResult = await judgeSubmission(problem, language || "javascript", code);

    // Calculate XP
    let xpEarned = 0;
    let streakBonus = 0;
    if (judgeResult.status === "Accepted") {
      xpEarned = problem.difficulty === "Easy" ? 10 : problem.difficulty === "Medium" ? 20 : 40;
    }

    // Save Submission
    const submission = new CodingSubmission({
      userId,
      problemId,
      language: language || "javascript",
      code,
      status: judgeResult.status,
      passCount: judgeResult.passCount,
      totalTestCases: judgeResult.totalTestCases,
      passPercentage: judgeResult.passPercentage,
      basicPassed: judgeResult.basicPassed,
      basicTotal: judgeResult.basicTotal,
      mediumPassed: judgeResult.mediumPassed,
      mediumTotal: judgeResult.mediumTotal,
      hardPassed: judgeResult.hardPassed,
      hardTotal: judgeResult.hardTotal,
      runtimeMs: judgeResult.runtimeMs,
      memoryMb: judgeResult.memoryMb,
      xpEarned,
      isDailyChallenge: !!isDailyChallenge
    });

    await submission.save();

    // Update User Stats, Streaks, & Decay Model
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (judgeResult.status === "Accepted") {
          // Add to solved problems if not already solved
          if (!user.solvedProblems.includes(problemId)) {
            user.solvedProblems.push(problemId);
          }

          // Streak update
          const today = new Date().toISOString().split("T")[0];
          if (user.lastCodingDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
            if (user.lastCodingDate === yesterday) {
              user.codingStreak = (user.codingStreak || 0) + 1;
            } else {
              user.codingStreak = 1;
            }
            user.lastCodingDate = today;

            // Bonus Streak Rewards
            if (user.codingStreak === 3) streakBonus += 20;
            if (user.codingStreak === 7) streakBonus += 50;
            if (user.codingStreak === 30) streakBonus += 300;
          }

          user.xp = (user.xp || 0) + xpEarned + streakBonus;
          user.level = Math.floor((user.xp) / 100) + 1;

          // Update Topic Mastery (Boost mastery by 10% on acceptance, max 100%)
          const currentMastery = user.topicMastery?.get(problem.category) || 50;
          const updatedMastery = Math.min(100, currentMastery + 8);
          if (!user.topicMastery) user.topicMastery = new Map();
          user.topicMastery.set(problem.category, updatedMastery);

          // If Daily Challenge, record completion
          if (isDailyChallenge) {
            const dc = await DailyChallenge.findOne({ problem: problemId });
            if (dc && !dc.completions.some(c => c.user?.toString() === userId)) {
              dc.completions.push({
                user: userId,
                runtimeMs: judgeResult.runtimeMs,
                memoryMb: judgeResult.memoryMb,
                language: language || "javascript"
              });
              await dc.save();
            }
          }

          await user.save();
        }
      }
    }

    res.json({
      submissionId: submission._id,
      status: judgeResult.status,
      passCount: judgeResult.passCount,
      totalTestCases: judgeResult.totalTestCases,
      passPercentage: judgeResult.passPercentage,
      basicPassed: judgeResult.basicPassed,
      basicTotal: judgeResult.basicTotal,
      basicResults: judgeResult.basicResults,
      mediumPassed: judgeResult.mediumPassed,
      mediumTotal: judgeResult.mediumTotal,
      hardPassed: judgeResult.hardPassed,
      hardTotal: judgeResult.hardTotal,
      runtimeMs: judgeResult.runtimeMs,
      memoryMb: judgeResult.memoryMb,
      xpEarned: xpEarned + streakBonus,
      streakBonus
    });
  } catch (error) {
    console.error("Submit solution error:", error);
    res.status(500).json({ message: "Failed to submit solution" });
  }
};

// 5. Get Daily Coding Challenge
const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = days[new Date().getDay()];

    let challenge = await DailyChallenge.findOne({ date: today }).populate("problem");
    
    // Auto-create if not found
    if (!challenge) {
      let diff = "Medium";
      if (dayOfWeek === "Monday" || dayOfWeek === "Tuesday") diff = "Easy";
      if (dayOfWeek === "Saturday") diff = "Hard";

      const problem = await CodingProblem.findOne({ difficulty: diff }) || await CodingProblem.findOne({});
      const xpReward = diff === "Easy" ? 10 : diff === "Medium" ? 20 : 40;

      challenge = await DailyChallenge.create({
        date: today,
        dayOfWeek,
        difficulty: diff,
        problem: problem._id,
        xpReward
      });
      challenge = await DailyChallenge.findById(challenge._id).populate("problem");
    }

    const { userId } = req.query;
    let isCompleted = false;
    if (userId && challenge.completions) {
      isCompleted = challenge.completions.some(c => c.user?.toString() === userId);
    }

    // Generate Weekly Schedule with Accessible Problems
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const allProblems = await CodingProblem.find().select("_id title category difficulty").lean();
    
    const weeklySchedule = dayNames.map((dName, idx) => {
      let diff = "Medium";
      let xp = 20;
      if (dName === "Monday" || dName === "Tuesday") { diff = "Easy"; xp = 10; }
      else if (dName === "Saturday") { diff = "Hard"; xp = 40; }
      else if (dName === "Sunday") { diff = "Mixed Challenge"; xp = 30; }

      // Find a matching problem
      const prob = (diff === "Mixed Challenge")
        ? allProblems[idx % allProblems.length]
        : (allProblems.find(p => p.difficulty === diff) || allProblems[0]);

      return {
        day: dName,
        diff,
        xp,
        problemId: prob ? prob._id : challenge.problem?._id,
        problemTitle: prob ? prob.title : challenge.problem?.title
      };
    });

    // Generate LeetCode-style Monthly Calendar Days
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[currentMonth];

    // Get all challenges completed by this user in the current month
    const userCompletedDates = new Set();
    if (userId) {
      const user = await User.findById(userId).select("completedChallenges solvedProblems");
      if (user && user.completedChallenges) {
        user.completedChallenges.forEach(cc => {
          if (cc.challengeDate) userCompletedDates.add(cc.challengeDate);
        });
      }

      // Also check DailyChallenge collection completions
      const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
      const monthChallenges = await DailyChallenge.find({ date: { $regex: `^${monthPrefix}` } }).lean();
      monthChallenges.forEach(mc => {
        if (mc.completions && mc.completions.some(c => c.user?.toString() === userId)) {
          userCompletedDates.add(mc.date);
        }
      });
    }

    const monthDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayDate = new Date(currentYear, currentMonth, d);
      const dayOfWeekStr = days[dayDate.getDay()];
      const isDayToday = dateStr === today;
      const isDayCompleted = userCompletedDates.has(dateStr) || (isDayToday && isCompleted);

      let dayDiff = "Medium";
      if (dayOfWeekStr === "Monday" || dayOfWeekStr === "Tuesday") dayDiff = "Easy";
      if (dayOfWeekStr === "Saturday") dayDiff = "Hard";

      const dayProb = allProblems[(d * 7) % allProblems.length] || allProblems[0];

      monthDays.push({
        dayNumber: d,
        date: dateStr,
        dayOfWeek: dayOfWeekStr,
        difficulty: dayDiff,
        isCompleted: isDayCompleted,
        isToday: isDayToday,
        problemId: isDayToday && challenge.problem ? challenge.problem._id : (dayProb ? dayProb._id : null),
        problemTitle: isDayToday && challenge.problem ? challenge.problem.title : (dayProb ? dayProb.title : "Daily Algorithm")
      });
    }

    const completedDaysCount = monthDays.filter(md => md.isCompleted).length;
    const hasMonthlyBadge = completedDaysCount >= daysInMonth || (completedDaysCount >= 28);

    res.json({
      date: challenge.date,
      dayOfWeek: challenge.dayOfWeek,
      difficulty: challenge.difficulty,
      problem: challenge.problem,
      xpReward: challenge.xpReward,
      totalCompletions: challenge.completions?.length || 0,
      isCompleted,
      weeklySchedule,
      monthDays,
      monthlyStats: {
        monthName,
        year: currentYear,
        completedCount: completedDaysCount,
        totalDays: daysInMonth,
        percentage: Math.round((completedDaysCount / daysInMonth) * 100),
        hasMonthlyBadge,
        badgeName: `${monthName} ${currentYear} Coding Champion`,
        badgeDescription: `Mastered the 30-Day Daily Coding Challenge Protocol for ${monthName} ${currentYear}.`
      }
    });
  } catch (error) {
    console.error("Get daily challenge error:", error);
    res.status(500).json({ message: "Failed to load daily challenge" });
  }
};

// 6. AI Coach Progressive Hints
const getAIHint = async (req, res) => {
  try {
    const { problemId, hintLevel = 1, userCode } = req.body;
    const problem = await CodingProblem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const hint = await getProgressiveHint(problem, hintLevel, userCode);
    res.json({ hint, hintLevel });
  } catch (error) {
    console.error("AI Hint error:", error);
    res.status(500).json({ message: "Failed to generate AI hint" });
  }
};

// 7. AI Code Mistake Diagnosis
const diagnoseMistake = async (req, res) => {
  try {
    const { problemId, code, language, errorOutput } = req.body;
    const problem = await CodingProblem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const diagnosis = await analyzeCodeMistake(problem, code, language, errorOutput);
    res.json({ diagnosis });
  } catch (error) {
    console.error("Diagnose error:", error);
    res.status(500).json({ message: "Failed to diagnose code" });
  }
};

// 8. User Submissions History
const getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await CodingSubmission.find({ userId })
      .populate("problemId", "title difficulty category")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(submissions);
  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(500).json({ message: "Failed to fetch user submissions" });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  runTestCases,
  submitSolution,
  getDailyChallenge,
  getAIHint,
  diagnoseMistake,
  getUserSubmissions
};
