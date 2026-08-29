const DSALearningPath = require("../models/DSALearningPath");
const User = require("../models/User");

// 1. Get All 25 Learning Sets with Progress
const getLearningSets = async (req, res) => {
  try {
    const { userId } = req.query;
    const sets = await DSALearningPath.find()
      .select("setNumber title category difficulty description xpReward")
      .sort({ setNumber: 1 })
      .lean();

    let userProgress = { completedSets: [], currentSet: 1, setScores: {} };
    if (userId) {
      const user = await User.findById(userId).select("learningPathProgress");
      if (user && user.learningPathProgress) {
        userProgress = {
          completedSets: user.learningPathProgress.completedSets || [],
          currentSet: user.learningPathProgress.currentSet || 1,
          setScores: user.learningPathProgress.setScores ? Object.fromEntries(user.learningPathProgress.setScores) : {}
        };
      }
    }

    const formattedSets = sets.map(s => {
      const isCompleted = userProgress.completedSets.includes(s.setNumber);
      const isUnlocked = s.setNumber === 1 || userProgress.completedSets.includes(s.setNumber - 1) || s.setNumber <= userProgress.currentSet;
      const score = userProgress.setScores[s.setNumber] || 0;

      return {
        ...s,
        isCompleted,
        isUnlocked,
        score
      };
    });

    res.json({
      sets: formattedSets,
      totalSets: sets.length,
      completedCount: userProgress.completedSets.length,
      currentSet: userProgress.currentSet
    });
  } catch (error) {
    console.error("Get learning sets error:", error);
    res.status(500).json({ message: "Failed to fetch learning sets" });
  }
};

const CodingProblem = require("../models/CodingProblem");

// 2. Get Single Learning Set Details (Enriched with real Coding Problems)
const getSetDetails = async (req, res) => {
  try {
    const { setNumber } = req.params;
    const set = await DSALearningPath.findOne({ setNumber: parseInt(setNumber) }).lean();

    if (!set) {
      return res.status(404).json({ message: "DSA Set not found" });
    }

    // Match coding problems for this set's category
    let matchingProblems = await CodingProblem.find({ 
      category: { $regex: new RegExp(set.category || set.title, "i") } 
    }).select("_id title difficulty description category timeComplexity").limit(3).lean();

    if (!matchingProblems || matchingProblems.length === 0) {
      const skipCount = ((parseInt(setNumber) - 1) * 3) % 200;
      matchingProblems = await CodingProblem.find()
        .select("_id title difficulty description category timeComplexity")
        .skip(skipCount)
        .limit(3)
        .lean();
    }

    const enrichedExercises = matchingProblems.map(p => ({
      problemId: p._id,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category,
      description: p.description ? p.description.split("\n")[0].substring(0, 120) : "Algorithmic practice challenge.",
      timeComplexity: p.timeComplexity
    }));

    set.practiceExercises = enrichedExercises;

    res.json(set);
  } catch (error) {
    console.error("Get set details error:", error);
    res.status(500).json({ message: "Failed to load set details" });
  }
};

// 3. Submit 5-Question Set Quiz Assessment
const submitSetQuiz = async (req, res) => {
  try {
    const { setNumber } = req.params;
    const { userId, answers } = req.body; // answers = { [questionIndex]: "Selected Answer" }

    const set = await DSALearningPath.findOne({ setNumber: parseInt(setNumber) });
    if (!set) return res.status(404).json({ message: "DSA Set not found" });

    let correctCount = 0;
    const results = set.quizQuestions.map((q, idx) => {
      const userAnswer = answers[idx] || answers[q._id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionIndex: idx + 1,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePercentage = Math.round((correctCount / set.quizQuestions.length) * 100);
    const isPassed = scorePercentage >= 60; // 60% or 3/5 to pass and unlock next set

    let xpAwarded = correctCount * 10;
    if (scorePercentage === 100) xpAwarded += 20; // Perfect score bonus

    // Update User Progress
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (!user.learningPathProgress) {
          user.learningPathProgress = { completedSets: [], currentSet: 1, setScores: new Map() };
        }

        const num = parseInt(setNumber);
        if (isPassed && !user.learningPathProgress.completedSets.includes(num)) {
          user.learningPathProgress.completedSets.push(num);
          user.learningPathProgress.currentSet = Math.max(user.learningPathProgress.currentSet || 1, num + 1);
        }

        if (!user.learningPathProgress.setScores) {
          user.learningPathProgress.setScores = new Map();
        }
        user.learningPathProgress.setScores.set(String(num), scorePercentage);

        // Daily Quiz Streak Update
        const today = new Date().toISOString().split("T")[0];
        if (user.lastQuizDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          if (user.lastQuizDate === yesterday) {
            user.quizStreak = (user.quizStreak || 0) + 1;
          } else {
            user.quizStreak = 1;
          }
          user.lastQuizDate = today;
        }

        user.xp = (user.xp || 0) + xpAwarded;
        user.level = Math.floor(user.xp / 100) + 1;

        // Update Topic Mastery
        if (!user.topicMastery) user.topicMastery = new Map();
        const currentMastery = user.topicMastery.get(set.category) || 50;
        user.topicMastery.set(set.category, Math.min(100, currentMastery + (isPassed ? 10 : 2)));

        await user.save();
      }
    }

    res.json({
      setNumber: parseInt(setNumber),
      scorePercentage,
      correctCount,
      totalQuestions: set.quizQuestions.length,
      isPassed,
      xpAwarded,
      nextSetUnlocked: isPassed ? parseInt(setNumber) + 1 : null,
      results
    });
  } catch (error) {
    console.error("Submit set quiz error:", error);
    res.status(500).json({ message: "Failed to evaluate set quiz" });
  }
};

module.exports = {
  getLearningSets,
  getSetDetails,
  submitSetQuiz
};
