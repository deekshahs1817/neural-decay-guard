const express = require("express");
const router = express.Router();
const { getGlobalMetrics, getUsers, generateAIProblem, getJudgeAuditReport } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// Protect admin routes
router.get("/metrics", adminAuth, getGlobalMetrics);
router.get("/users", adminAuth, getUsers);
router.post("/problems/generate", adminAuth, generateAIProblem);

// Judge Quality & Audit Dashboard
router.get("/judge-audit", adminAuth, getJudgeAuditReport);

module.exports = router;
