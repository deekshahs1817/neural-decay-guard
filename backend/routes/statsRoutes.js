const express = require("express");
const router = express.Router();
const { getUserStats, updateUserProfile } = require("../controllers/statsController");

router.get("/userStats/:userId", getUserStats);
router.put("/userStats/:userId/profile", updateUserProfile);

module.exports = router;