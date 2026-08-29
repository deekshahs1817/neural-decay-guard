const Submission = require("../models/Submission");

const getQuizHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const attempts = await Submission.find({ userId })
      .populate("problemId", "title category difficulty") // Fetch problem details
      .sort({ createdAt: -1 })
      .limit(50); // Get recent 50 Submissions
    
    // Map to unified structure the frontend expects (or adapt frontend)
    // The previous frontend expected { date, score }. We will map it smoothly.
    const mappedHistory = attempts.map(sub => ({
      _id: sub._id,
      date: sub.createdAt,
      score: sub.status === "Accepted" ? 100 : 0,
      subject: sub.problemId ? sub.problemId.title : "Unknown Problem",
      status: sub.status
    }));

    res.json(mappedHistory);

  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getQuizHistory };