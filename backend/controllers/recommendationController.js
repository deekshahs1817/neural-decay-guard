const Submission = require("../models/Submission");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getRecommendation = async (req, res) => {
  try {
    const { userId } = req.params;
    // Populate problem for categories
    const attempts = await Submission.find({ userId }).populate("problemId");

    if (attempts.length === 0) {
      return res.json([
        {
          title: "Neural Initialization Required",
          description: "Complete your first brain training session to unlock AI insights.",
          priority: "High",
          category: "Getting Started"
        }
      ]);
    }

    const categories = ["Memory", "Logic", "Speed", "Attention", "Problem Solving"];
    const stats = categories.map(cat => {
      const catAttempts = attempts.filter(a => a.problemId && a.problemId.category === cat);
      const catCorrect = catAttempts.filter(a => a.status === "Accepted").length;
      const accuracy = catAttempts.length > 0 ? (catCorrect / catAttempts.length) * 100 : 0;
      return { category: cat, accuracy, count: catAttempts.length };
    });

    // Find weakest category
    const weakest = stats.sort((a, b) => a.accuracy - b.accuracy)[0];
    
    // AI Integration for Pro Insights
    let aiPrescription = "Continue your daily training path.";
    try {
      if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `Based on the following user performance data, generate a one-sentence "Neural Prescription" as a professional brain coach. 
        Data: ${JSON.stringify(stats)}. 
        Weakest Category: ${weakest.category} (${Math.round(weakest.accuracy)}% accuracy).
        The prescription should be encouraging, clinical, and high-end.`;

        const result = await model.generateContent(prompt);
        aiPrescription = result.response.text().trim();
      }
    } catch (aiErr) {
      console.error("AI Rec Error:", aiErr);
    }

    // Build Pro recommendations
    const recommendations = [
      {
        title: `Priority: ${weakest.category}`,
        description: `Neural accuracy in ${weakest.category} is currently ${Math.round(weakest.accuracy)}%. ${aiPrescription}`,
        priority: weakest.accuracy < 60 ? 'High' : 'Medium',
        category: weakest.category
      },
      {
         title: "Spacing Repetition Alert",
         description: "A logic puzzle you solved 3 days ago is ready for re-validation to strengthen synaptic pathways.",
         priority: "Medium",
         category: "Logic"
      },
      {
         title: "Neural Velocity Challenge",
         description: "Try solving 5 problems in under 3 minutes to improve your processing speed score.",
         priority: "Low",
         category: "Speed"
      }
    ];

    res.json(recommendations);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};