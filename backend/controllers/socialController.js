const User = require("../models/User");

exports.addFriend = async (req, res) => {
  try {
    const { userId, friendEmail } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const friend = await User.findOne({ email: friendEmail });
    if (!friend) return res.status(404).json({ message: "No registered detective found with that email." });

    if (user._id.toString() === friend._id.toString()) {
      return res.status(400).json({ message: "You cannot add yourself." });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "You are already connected to this user." });
    }

    // Two-way friendship mapped automatically
    user.friends.push(friend._id);
    friend.friends.push(user._id);

    await user.save();
    await friend.save();

    res.json({ message: "Successfully connected to " + friend.name, friend: friend.name });
  } catch (error) {
    console.error("Add Friend Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getFriendsLeaderboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("friends", "name streak xp level badges");
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const leaderboard = [
      { name: user.name, streak: user.streak, xp: user.xp, level: user.level, badges: user.badges },
      ...user.friends
    ];

    // Rank friends heavily by Gamification logic
    leaderboard.sort((a, b) => b.xp - a.xp || b.level - a.level);

    res.json(leaderboard);
  } catch (error) {
    console.error("Get Friends Leaderboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
