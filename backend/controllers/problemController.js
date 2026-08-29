const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/User");
const DSALearningPath = require("../models/DSALearningPath");
const CoreSubjectCourse = require("../models/CoreSubjectCourse");

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 1. Get all problems with filters
const getProblems = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    const problems = await Problem.find(query).select("-testCases").sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get single problem by ID
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Submit solution to a single problem
const submitSolution = async (req, res) => {
  try {
    const { userId, problemId, selectedAnswer, timeSpentSecs } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const isCorrect = (problem.correctAnswer === selectedAnswer);
    const status = isCorrect ? "Accepted" : "Wrong Answer";

    // Create Submission record
    const submission = new Submission({
      userId,
      problemId,
      status,
      submittedAnswer: selectedAnswer,
      timeSpentSecs
    });
    await submission.save();

    // Update Problem stats
    problem.totalAttempts += 1;
    if (isCorrect) problem.successfulAttempts += 1;
    await problem.save();

    // Gamification & User Stats
    const user = await User.findById(userId);
    let leveledUp = false;

    if (user && isCorrect) {
      if (!user.xp) user.xp = 0;
      if (!user.level) user.level = 1;

      const xpGains = { "Easy": 10, "Medium": 20, "Hard": 30 };
      const gained = xpGains[problem.difficulty] || 10;
      user.xp += gained;

      const newLevel = Math.floor(user.xp / 100) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        leveledUp = true;
      }

      await user.save();
    }

    res.json({
      status,
      isCorrect,
      explanation: problem.explanation,
      leveledUp,
      newLevel: user?.level
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Get Daily Random Spaced-Repetition Quiz tailored to User's Knowledge Profile
const getDailyRandomQuiz = async (req, res) => {
  try {
    const { userId } = req.query;
    const tzOffsetMinutes = typeof req.query.tzOffset !== "undefined" ? parseInt(req.query.tzOffset, 10) : -330;
    const clientTodayStr = req.query.clientDate || new Date(Date.now() - (tzOffsetMinutes * 60000)).toISOString().split("T")[0];

    // Check if user has already submitted today's quiz
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.lastQuizDate === clientTodayStr) {
        return res.json({
          alreadyCompleted: true,
          streak: user.quizStreak || 0,
          message: "You have already completed today's Daily Retention Quiz! Come back tomorrow to continue your streak."
        });
      }
    }

    let targetTopics = [];

    if (userId) {
      const user = await User.findById(userId).select("masteredTopics learningTopics");
      if (user) {
        targetTopics = [
          ...(user.masteredTopics || []),
          ...(user.learningTopics || [])
        ];
      }
    }

    if (!targetTopics || targetTopics.length === 0) {
      targetTopics = ["Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming"];
    }

    let matchedQuestions = [];
    const topicRegex = targetTopics.map(t => new RegExp(t, "i"));

    // Source from Problem collection
    const problemQuestions = await Problem.find({
      $or: [
        { category: { $in: topicRegex } },
        { type: "mcq" }
      ]
    }).limit(15).lean();

    problemQuestions.forEach(p => {
      matchedQuestions.push({
        _id: p._id,
        question: p.description || p.title,
        options: shuffleArray(p.options || []),
        category: p.category || "DSA",
        correctAnswer: p.correctAnswer,
        explanation: p.explanation
      });
    });

    // Source from DSA Learning Path questions
    const dsaSets = await DSALearningPath.find({
      category: { $in: topicRegex }
    }).limit(5).lean();

    dsaSets.forEach(set => {
      set.quizQuestions?.forEach(q => {
        matchedQuestions.push({
          _id: q._id,
          question: q.question,
          options: shuffleArray(q.options || []),
          category: set.category,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        });
      });
    });

    // Source from CSE Core Subject Courses
    const cseCourses = await CoreSubjectCourse.find().limit(3).lean();
    cseCourses.forEach(c => {
      c.sets?.slice(0, 3).forEach(s => {
        s.questions?.forEach(q => {
          matchedQuestions.push({
            _id: q._id,
            question: q.question,
            options: shuffleArray(q.options || []),
            category: c.title,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          });
        });
      });
    });

    const shuffled = shuffleArray(matchedQuestions);
    const finalFive = shuffled.slice(0, 5).map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      category: q.category
    }));

    res.json({ 
      questions: finalFive,
      personalizedTopics: targetTopics,
      message: `Generated 5-question spaced repetition quiz tailored to your Knowledge Profile.`
    });
  } catch (error) {
    console.error("Get daily random quiz error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 5. Submit Multi-Question Retention Quiz (Strict 1 Submission Per Calendar Day)
const submitDailyQuiz = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const tzOffsetMinutes = typeof req.body.tzOffset !== "undefined" ? parseInt(req.body.tzOffset, 10) : -330;
    const clientTodayStr = req.body.clientDate || new Date(Date.now() - (tzOffsetMinutes * 60000)).toISOString().split("T")[0];

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Strict 1-submission-per-day check
    if (user.lastQuizDate === clientTodayStr) {
      return res.status(400).json({
        alreadyCompleted: true,
        message: "Daily Retention Quiz can only be submitted once per calendar day.",
        streak: user.quizStreak || 0
      });
    }

    let score = 0;
    let correctCount = 0;
    const totalQuestions = Object.keys(answers || {}).length;
    
    // Evaluate and save Submission logs
    for (const [qid, selected] of Object.entries(answers || {})) {
      const p = await Problem.findById(qid);
      let isCorrect = false;
      if (p && p.correctAnswer === selected) {
        score += 10;
        correctCount += 1;
        isCorrect = true;
        p.successfulAttempts += 1;
      }
      if (p) {
        p.totalAttempts += 1;
        await p.save();
      }

      // Persist individual Submission for telemetry
      if (userId) {
        const sub = new Submission({
          userId,
          problemId: qid,
          status: isCorrect ? "Accepted" : "Wrong Answer",
          submittedAnswer: selected,
          timeSpentSecs: 30
        });
        await sub.save().catch(err => console.error("Sub save err", err));
      }
    }

    // Strict consecutive calendar day streak calculation
    let newStreak = user.quizStreak || 0;
    if (user.lastQuizDate) {
      const lastDate = new Date(user.lastQuizDate + "T00:00:00");
      const curDate = new Date(clientTodayStr + "T00:00:00");
      const diffTime = curDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    user.lastQuizDate = clientTodayStr;
    user.quizStreak = newStreak;
    user.streak = newStreak;
    user.codingStreak = newStreak;
    
    const xpEarned = (score || 10) + 20;
    user.xp = (user.xp || 0) + xpEarned;
    user.level = Math.floor(user.xp / 100) + 1;

    // Record today in completedChallenges
    if (!user.completedChallenges) user.completedChallenges = [];
    if (!user.completedChallenges.some(cc => cc.challengeDate === clientTodayStr)) {
      user.completedChallenges.push({
        challengeDate: clientTodayStr,
        xpAwarded: xpEarned,
        completedAt: new Date()
      });
    }

    // Record today in dailyActivityMap
    if (!user.dailyActivityMap) user.dailyActivityMap = new Map();
    const curAct = user.dailyActivityMap.get(clientTodayStr) || 0;
    user.dailyActivityMap.set(clientTodayStr, curAct + 1);

    await user.save();

    res.json({ 
      score, 
      correctCount,
      totalQuestions,
      streak: newStreak,
      xpEarned,
      message: "Daily Retention Quiz Completed Successfully!"
    });
  } catch (error) {
    console.error("Submit daily quiz error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  submitSolution,
  getDailyRandomQuiz,
  submitDailyQuiz
};
