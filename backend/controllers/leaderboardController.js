const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {

    const users = await User
      .find()
      .sort({ xp: -1, level: -1, streak: -1 })
      .limit(20)
      .select("name streak xp level badges");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};