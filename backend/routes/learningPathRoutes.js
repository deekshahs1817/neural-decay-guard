const express = require("express");
const router = express.Router();
const {
  getLearningSets,
  getSetDetails,
  submitSetQuiz
} = require("../controllers/learningPathController");

router.get("/sets", getLearningSets);
router.get("/sets/:setNumber", getSetDetails);
router.post("/sets/:setNumber/submit", submitSetQuiz);

module.exports = router;
