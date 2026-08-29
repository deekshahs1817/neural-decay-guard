const User = require("../models/User");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { auditEntireJudgeSystem } = require("../services/auditService");

exports.getGlobalMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    
    const activeSubmissions = await Submission.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // last 24h
    });

    res.json({
      totalUsers,
      totalProblems,
      totalSubmissions,
      activeSubmissions
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.generateAIProblem = async (req, res) => {
  try {
    const { promptTopic } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      const fallbackProblem = new Problem({
        title: `AI Generated: ${promptTopic}`,
        description: `This is a mock problem generated because the Gemini API key was not found. Please implement the algorithm for: ${promptTopic}.`,
        category: "Algorithms",
        difficulty: "Medium",
        options: ["O(N)", "O(1)", "O(N^2)", "O(log N)"],
        correctAnswer: "O(N)",
        explanation: "This is a placeholder explanation."
      });
      await fallbackProblem.save();
      return res.json({ message: "Successfully created fallback problem.", problem: fallbackProblem });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert LeetCode problem creator. Create a single computer science problem about: "${promptTopic}".
    Return ONLY a valid raw JSON object (no markdown, no backticks, no markdown formatting) with the following exact keys:
    {
      "title": "Problem Title",
      "description": "HTML formatted detailed problem description with examples",
      "category": "Data Structures or Algorithms etc",
      "difficulty": "Easy or Medium or Hard",
      "options": ["option 1", "option 2", "option 3", "option 4"],
      "correctAnswer": "exact string match from options",
      "explanation": "Detailed explanation of the correct answer"
    }`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const problemData = JSON.parse(text);
    
    if (!['Easy', 'Medium', 'Hard'].includes(problemData.difficulty)) {
       problemData.difficulty = 'Medium';
    }

    const newProblem = new Problem(problemData);
    await newProblem.save();

    res.json({ message: "Successfully generated and injected problem via Gemini.", problem: newProblem });

  } catch (error) {
    console.error("AI Generation Error:", error.message);
    res.status(500).json({ message: "Failed to generate AI problem: " + error.message });
  }
};

/**
 * Judge Engine Audit & Quality Metrics
 */
exports.getJudgeAuditReport = async (req, res) => {
  try {
    const report = await auditEntireJudgeSystem();
    res.json(report);
  } catch (error) {
    console.error("Judge Audit Error:", error);
    res.status(500).json({ message: "Failed to generate judge audit report: " + error.message });
  }
};
