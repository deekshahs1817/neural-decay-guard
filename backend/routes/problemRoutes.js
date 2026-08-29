const express = require("express");
const router = express.Router();
const { getProblems, getProblemById, submitSolution, getDailyRandomQuiz, submitDailyQuiz } = require("../controllers/problemController");

router.get("/problems", getProblems);
router.get("/daily-random", getDailyRandomQuiz);
router.post("/submitQuiz", submitDailyQuiz);
router.get("/problems/:id", getProblemById);
router.post("/submit", submitSolution);

module.exports = router;
