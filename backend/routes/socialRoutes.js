const express = require("express");
const router = express.Router();
const socialController = require("../controllers/socialController");

router.post("/friends/add", socialController.addFriend);
router.get("/friends/leaderboard/:userId", socialController.getFriendsLeaderboard);

module.exports = router;
