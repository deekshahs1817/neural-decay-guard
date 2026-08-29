const express = require("express");
const router = express.Router();

const { getDecayPrediction } = require("../controllers/decayController");

router.get("/decay/:userId", getDecayPrediction);

module.exports = router;