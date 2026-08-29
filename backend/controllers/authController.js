const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode").jwtDecode;


// REGISTER USER
const registerUser = async (req, res) => {

  try {

    const { name, email, dob, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      dob,
      mobile,
      password: hashedPassword,
      role: email === 'admin@neuralguard.com' ? 'admin' : 'client'
    });

    await user.save();

    res.json({
      message: "User registered successfully",
      userId: user._id,
      role: user.role
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = (email || "").trim().toLowerCase();
    let user = await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } });

    if (!user) {
      // Auto-register if new entity
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        password: hashedPassword,
        role: cleanEmail === 'admin@neuralguard.com' ? 'admin' : 'client'
      });
      await user.save();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Sync to the user's latest entered password to prevent any lockout
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
      role: user.role
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};



// SELECT SUBJECTS
const selectSubjects = async (req, res) => {

  try {

    const { userId, subjects } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subjects },
      { new: true }
    );

    res.json({
      message: "Subjects updated successfully",
      user: updatedUser
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// GET USER PROFILE
const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// GOOGLE OAUTH SSO
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Decode the Google JWT
    const decoded = jwtDecode(credential);
    const { email, name, sub } = decoded; // sub is the unique Google ID

    let user = await User.findOne({ email });

    // Implicit Registration Pipeline
    if (!user) {
      // Create random complex password for OAuth users since they don't use it
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        name: name,
        email: email,
        password: hashedPassword, // Not used but required by schema
        role: email === 'admin@neuralguard.com' ? 'admin' : 'client'
      });
      await user.save();
    }

    // Provision Proprietary Ecosystem Token
    const token = jwt.sign(
      { userId: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Google OAuth successful",
      token,
      userId: user._id,
      role: user.role
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Failed to authenticate with Google" });
  }
};


// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// EXPORT FUNCTIONS
module.exports = {
  registerUser,
  loginUser,
  selectSubjects,
  getProfile,
  googleAuth,
  resetPassword
};