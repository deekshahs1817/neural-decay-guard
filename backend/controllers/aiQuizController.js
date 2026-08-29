const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateAIQuiz = async (req, res) => {
  try {

    const { subject, level } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `
Generate 5 multiple choice quiz questions for ${subject}.
Difficulty level: ${level}.

Return strictly in JSON format:
[
 { "question":"", "options":["","","",""], "answer":"" }
]
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    res.json({
      subject,
      level,
      quiz: text
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};