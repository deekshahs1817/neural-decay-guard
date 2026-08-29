const express = require("express");
const router = express.Router();
const {
  getProblems,
  getProblemById,
  runTestCases,
  submitSolution,
  getDailyChallenge,
  getAIHint,
  diagnoseMistake,
  getUserSubmissions,
  toggleCalendarDay
} = require("../controllers/codingController");

// Problems
router.get("/problems", getProblems);
router.get("/problems/:id", getProblemById);

// Judge & Run
router.post("/run", runTestCases);
router.post("/submit", submitSolution);

// Daily Challenge
router.get("/daily-challenge", getDailyChallenge);
router.post("/toggle-calendar-day", toggleCalendarDay);

// Submissions History
router.get("/submissions/:userId", getUserSubmissions);

// AI Coach Integrations
router.post("/ai-hint", getAIHint);
router.post("/ai-diagnose", diagnoseMistake);

module.exports = router;
