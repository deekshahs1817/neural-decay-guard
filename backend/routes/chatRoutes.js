const express = require("express");
const router = express.Router();
const { handleChatMessage } = require("../controllers/chatController");

router.post("/chat", handleChatMessage);

module.exports = router;
