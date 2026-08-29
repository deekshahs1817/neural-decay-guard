require("dotenv").config();
require("./services/notificationScheduler").initScheduler();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { seedDSAData } = require("./services/dsaSeedData");
const { seedCoreSubjects } = require("./services/coreSubjectsSeed");

const authRoutes = require("./routes/authRoutes");
const statsRoutes = require("./routes/statsRoutes");
const decayRoutes = require("./routes/decayRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const historyRoutes = require("./routes/historyRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const problemRoutes = require("./routes/problemRoutes");
const adminRoutes = require("./routes/adminRoutes");
const codingRoutes = require("./routes/codingRoutes");
const learningPathRoutes = require("./routes/learningPathRoutes");
const coreSubjectRoutes = require("./routes/coreSubjectRoutes");

const app = express();

// Connect database & automatically seed DSA system and CSE Core Subjects
connectDB().then(async () => {
  try {
    const User = require("./models/User");
    await User.updateMany({}, { $set: { streak: 0, quizStreak: 0, codingStreak: 0, lastQuizDate: null } });
    await seedDSAData();
    await seedCoreSubjects();
    console.log("Database initialized & curriculum seeded successfully.");
  } catch (err) {
    console.error("Database seeding error:", err);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/learning-path", learningPathRoutes);
app.use("/api/core-subjects", coreSubjectRoutes);
app.use("/api", authRoutes);
app.use("/api", statsRoutes);
app.use("/api", decayRoutes);
app.use("/api", recommendationRoutes);
app.use("/api", historyRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", problemRoutes);
app.use("/api", require("./routes/chatRoutes"));
app.use("/api", require("./routes/socialRoutes"));
app.use("/api/enterprise", require("./routes/enterpriseRoutes"));

// Serve Frontend Static Files in Production (Unified Deployment)
const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

// Unified SPA Fallback
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});