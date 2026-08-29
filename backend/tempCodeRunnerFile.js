require("./services/reminderScheduler");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

// connect database
connectDB();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", authRoutes);
app.use("/api", quizRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Neural Decay Guard Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});