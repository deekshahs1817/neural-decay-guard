const User = require("../models/User");
const Team = require("../models/Team");
const Submission = require("../models/Submission");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Get Enterprise Overview (Aggregated)
exports.getEnterpriseMetrics = async (req, res) => {
  try {
    const teams = await Team.find().populate("members", "name email xp level streak");
    const totalUsers = await User.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    // Calculate Global Performance across teams
    const teamStats = await Promise.all(teams.map(async (team) => {
       const memberIds = team.members.map(m => m._id);
       const submissions = await Submission.find({ userId: { $in: memberIds } });
       const correct = submissions.filter(s => s.status === 'Accepted').length;
       const accuracy = submissions.length > 0 ? (correct / submissions.length) * 100 : 85; // Default for demo

       return {
         teamName: team.name,
         memberCount: team.members.length,
         avgAccuracy: Math.round(accuracy),
         totalXP: team.members.reduce((acc, m) => acc + (m.xp || 0), 0),
         dominantSkill: team.specialization
       };
    }));

    res.json({
      totalUsers,
      totalSubmissions,
      activeTeams: teams.length,
      teamStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. AI Skill Gap Detection
exports.getSkillGapAnalysis = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId).populate("members", "masteredTopics learningTopics");
    
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Aggregate team mastered/learning topics
    const allMastered = [...new Set(team.members.flatMap(m => m.masteredTopics || []))];
    const allLearning = [...new Set(team.members.flatMap(m => m.learningTopics || []))];

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ 
        gaps: ["Dynamic Programming", "Graph Theory", "Low-Level Optimization"],
        recommendation: "Simulation Mode: AI is currently offline. Showing cached skill gaps."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Act as a Neural Workforce Strategist. Analyze this team's cognitive profile:
    Team Specialization: ${team.specialization}
    Mastered Skills: ${allMastered.join(", ")}
    Currently Learning: ${allLearning.join(", ")}
    
    Identify the 3 most critical "Skill Gaps" that could cause "Neural Decay" in their department. 
    Format: Return ONLY a JSON object with keys: 'gaps' (array of 3 strings) and 'strategicAdvice' (one sentence).`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/gi, "").trim();
    
    res.json(JSON.parse(cleanJson));

  } catch (err) {
    console.error("AI Skill Gap Error:", err);
    res.status(500).json({ message: "Failed to detect skill gaps via AI" });
  }
};

// 3. Neural Decay Map
exports.getDecayMap = async (req, res) => {
  try {
     // For a crazy dashboard, we need intense data.
     // We'll calculate decay as (Correct Submissions / Total Submissions) per Category over the last 30 days.
     const categories = ["Memory", "Logic", "Speed", "Attention", "Problem Solving"];
     const monthAgo = new Date();
     monthAgo.setDate(monthAgo.getDate() - 30);

     const decayData = await Promise.all(categories.map(async (cat) => {
        const subs = await Submission.find({ createdAt: { $gte: monthAgo } }).populate({
          path: 'problemId',
          match: { category: cat }
        });
        
        const filtered = subs.filter(s => s.problemId); // Submissions actually in this category
        const correct = filtered.filter(s => s.status === 'Accepted').length;
        const total = filtered.length;
        
        const health = total > 0 ? (correct / total) * 100 : 70 + (Math.random() * 20); // Simulated baseline
        
        return {
           category: cat,
           health: Math.round(health),
           decayRate: Math.max(0, Math.round(100 - health))
        };
     }));

     res.json(decayData);
  } catch (err) {
     res.status(500).json({ message: err.message });
  }
};
