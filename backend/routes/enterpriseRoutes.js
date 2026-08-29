const express = require("express");
const router = express.Router();
const enterpriseController = require("../controllers/enterpriseController");

// Global Enterprise Stats
router.get("/metrics", enterpriseController.getEnterpriseMetrics);

// Team Decay Map
router.get("/decay-map", enterpriseController.getDecayMap);

// Skill Gap Analysis (AI)
router.get("/skill-gap/:teamId", enterpriseController.getSkillGapAnalysis);

module.exports = router;
