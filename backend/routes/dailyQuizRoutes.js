const express = require("express");
const router = express.Router();

const { getDailyQuiz } = require("../controllers/dailyQuizController");

router.get("/dailyQuiz/:userId", getDailyQuiz);

module.exports = router;