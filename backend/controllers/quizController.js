const Quiz = require("../models/Quiz");
const User = require("../models/User");
const QuizAttempt = require("../models/QuizAttempt");


// ADD QUIZ QUESTION
const addQuiz = async (req, res) => {
  try {

    const { subject, question, options, answer } = req.body;

    const quiz = new Quiz({
      subject,
      question,
      options,
      answer
    });

    await quiz.save();

    res.json({
      message: "Quiz added successfully",
      quiz
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};



// GET QUIZ BY SUBJECT
const getQuizBySubject = async (req, res) => {
  try {

    const { subject } = req.params;

    const quizzes = await Quiz.find({ subject });

    res.json(quizzes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};



// SUBMIT QUIZ + SAVE ATTEMPT + UPDATE STREAK
const submitQuiz = async (req, res) => {
  try {

    const { userId, subject, answers } = req.body;

    const quizzes = await Quiz.find({ subject });

    let score = 0;

    answers.forEach(ans => {

      const question = quizzes.find(
        q => q.question === ans.question
      );

      if (question && question.answer === ans.selected) {
        score++;
      }

    });

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Save quiz attempt
    const attempt = new QuizAttempt({
      userId,
      subject,
      score,
      totalQuestions: answers.length
    });

    await attempt.save();

    // Strict Daily Retention Quiz Streak Calculation
    const localNow = new Date();
    const today = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
    
    // Calculate difference in calendar days from last quiz
    let newStreak = user.quizStreak || user.streak || 0;
    if (user.lastQuizDate) {
      const lastDate = new Date(user.lastQuizDate + "T00:00:00");
      const curDate = new Date(today + "T00:00:00");
      const diffTime = curDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Solved on consecutive day
        newStreak += 1;
      } else if (diffDays > 1) {
        // Missed a day -> reset to 1
        newStreak = 1;
      } else if (diffDays === 0) {
        // Already solved today -> maintain current streak or initialize to 1
        newStreak = Math.max(1, newStreak);
      }
    } else {
      // First time solving retention quiz
      newStreak = Math.max(1, newStreak + 1);
    }

    user.streak = newStreak;
    user.quizStreak = newStreak;
    user.codingStreak = newStreak;
    user.lastQuizDate = today;

    const xpEarned = (score * 10) + 20;
    user.xp = (user.xp || 0) + xpEarned;
    user.level = Math.floor(user.xp / 100) + 1;

    // Record today's completion in completedChallenges
    if (!user.completedChallenges) user.completedChallenges = [];
    if (!user.completedChallenges.some(cc => cc.challengeDate === today)) {
      user.completedChallenges.push({
        challengeDate: today,
        xpAwarded: xpEarned,
        completedAt: new Date()
      });
    }

    // Record daily activity map
    if (!user.dailyActivityMap) user.dailyActivityMap = new Map();
    const currentActivity = user.dailyActivityMap.get(today) || 0;
    user.dailyActivityMap.set(today, currentActivity + 1);

    await user.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: answers.length || 5,
      streak: user.streak,
      quizStreak: user.quizStreak,
      xpEarned,
      todayCompleted: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};



// DAILY QUIZ GENERATOR
const getDailyQuiz = async (req, res) => {

  try {

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const subjects = user.subjects;

    const quizzes = await Quiz.aggregate([
      { $match: { subject: { $in: subjects } } },
      { $sample: { size: 5 } },
      { $project: { answer: 0, __v: 0 } }
    ]);

    res.json({
      message: "Daily quiz generated",
      quizzes
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// LEADERBOARD
const getLeaderboard = async (req, res) => {

  try {

    const users = await User.find()
      .sort({ streak: -1 })
      .limit(10)
      .select("name streak -_id");

    res.json({
      message: "Leaderboard",
      users
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// EXPORT FUNCTIONS
module.exports = {
  addQuiz,
  getQuizBySubject,
  submitQuiz,
  getDailyQuiz,
  getLeaderboard
};