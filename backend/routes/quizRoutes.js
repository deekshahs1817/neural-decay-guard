const express = require("express");
const router = express.Router();

const {
  addQuiz,
  getQuizBySubject,
  submitQuiz,
  getDailyQuiz,
  getLeaderboard
} = require("../controllers/quizController");

router.post("/quiz", addQuiz);

router.get("/quiz/:subject", getQuizBySubject);

router.post("/submitQuiz", submitQuiz);

router.get("/dailyQuiz/:userId", getDailyQuiz);

router.get("/leaderboard", getLeaderboard);

module.exports = router;
