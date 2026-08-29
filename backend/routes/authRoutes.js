const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  selectSubjects,
  googleAuth,
  resetPassword
} = require("../controllers/authController");


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/reset-password", resetPassword);

router.post("/google", googleAuth);

router.get("/me", verifyToken, getProfile);

router.post("/subjects", selectSubjects);

module.exports = router;