const Quiz = require("../models/Quiz");

exports.getDailyQuiz = async (req, res) => {
  try {

    const quizzes = await Quiz.aggregate([
      { $sample: { size: 10 } }
    ]);

    res.json({
      message: "Daily Quiz Generated",
      questions: quizzes
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};