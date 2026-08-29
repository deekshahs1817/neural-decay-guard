const express = require("express");
const router = express.Router();

const { getQuizHistory } = require("../controllers/historyController");

router.get("/history/:userId", getQuizHistory);

module.exports = router;