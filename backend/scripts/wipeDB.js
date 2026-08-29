const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const bcrypt = require("bcryptjs");

const wipeData = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected for Wipe...");

    await User.deleteMany({});
    await Problem.deleteMany({});
    await Submission.deleteMany({});

    console.log("All Collections Wiped Successfully.");

    // Create default Admin account
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "Master Admin",
      email: "admin@neuralguard.com",
      password: hashedPassword,
      role: "admin",
      streak: 5, 
      xp: 150,
      level: 2,
      badges: ["First Solve", "Scholar"]
    });
    await adminUser.save();
    console.log("Master Admin injected.");

    // Inject fake Submissions for Heatmap
    await Promise.all(Array.from({length: 10}).map(async (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (i % 7)); // Spread over last 7 days
        const s = new Submission({
            userId: adminUser._id,
            problemId: new mongoose.Types.ObjectId(), 
            status: "Accepted",
            submittedAnswer: "Test",
            timeSpentSecs: 30,
            createdAt: d // Mongoose sometimes overrides this, so we do updateOne next
        });
        await s.save();
        await mongoose.connection.collection('submissions').updateOne({_id: s._id}, {$set: {createdAt: d}});
    }));

    console.log("Heatmap data simulated.");

    // Inject a default problem so UI isn't perfectly empty
    const firstProblem = new Problem({
      title: "1. Two Sum (System Genesis)",
      description: "Given an array of integers and a target sum, which data structure is optimal to find the indices of the two numbers in O(N) time?",
      category: "Arrays",
      difficulty: "Easy",
      options: ["A sorted tree", "A Hash Map", "A Linked List", "Nested For Loops"],
      correctAnswer: "A Hash Map",
      explanation: "A Hash Map allows O(1) worst-case lookups."
    });
    await firstProblem.save();

    console.log("Wipe completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Wipe failed:", error);
    process.exit(1);
  }
};

wipeData();
