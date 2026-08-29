const User = require("../models/User");

// In a real production environment, you would use node-cron or Agenda.
// To ensure perfect portability for this environment, we use native setInterval
// configured to run daily checks for Email/SMS notification algorithms.

const checkDecayAndNotify = async () => {
  try {
    const inactiveDetectives = await User.find({
      // Mock logic: finding users who haven't logged in recently
      // In reality, this would cross-reference Submissions or login dates.
    });

    console.log(`[Notification Engine] Scanning ${inactiveDetectives.length} users for Cognitive Decay.`);

    // Nodemailer / Twilio mock dispatcher
    inactiveDetectives.forEach(user => {
      // If Twilio API Key exists, dispatch SMS
      if (process.env.TWILIO_AUTH_TOKEN) {
         console.log(`[Twilio SMS] Dispatched to ${user.mobile}: "Your Neural Streak is at risk!"`);
      }
      
      // If Nodemailer SMTP exists, dispatch Email
      if (process.env.SMTP_PASS) {
         console.log(`[SMTP Email] Sent to ${user.email} (Subject: "Maintain your Cognitive Armor")`);
      }
    });

  } catch (err) {
    console.error("[Notification Engine] Error scanning for decay:", err);
  }
};

// Start the scheduler daemon (Run every 24 hours)
const initScheduler = () => {
    console.log("[Notification Engine] Daemon initialized.");
    // 24 * 60 * 60 * 1000 = Daily. Here we run it once on boot for demonstration.
    setTimeout(checkDecayAndNotify, 5000); 
    setInterval(checkDecayAndNotify, 86400000);
}

module.exports = { initScheduler };
