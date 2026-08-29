const express = require("express");
const router = express.Router();
const { getGlobalMetrics, getUsers, generateAIProblem } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth"); // The new middleware

// Protect all admin routes
router.get("/metrics", adminAuth, getGlobalMetrics);
router.get("/users", adminAuth, getUsers);
router.post("/problems/generate", adminAuth, generateAIProblem);

module.exports = router;
