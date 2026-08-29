const express = require("express");
const router = express.Router();

const aiQuizController = require("../controllers/aiQuizController");

router.post("/generateQuiz", aiQuizController.generateAIQuiz);

module.exports = router;