const cron = require("node-cron");
const User = require("../models/User");
const sendReminderEmail = require("./emailService");
const sendReminderSMS = require("./smsService");

// TEST MODE (runs every 1 minute)
// TODO: Change to a daily schedule for production
cron.schedule("0 22 * * *", async () => {

  console.log("Running Reminder Job");

  try {

    const users = await User.find();

    for (const user of users) {

      console.log("Checking user:", user.email);

      if (user.streak === 0) {

        await sendReminderEmail(user.email, user.name);
        await sendReminderSMS(user.mobile, user.name);

        console.log("Reminders (Email & SMS) triggered for:", user.email);

      }

    }

  } catch (error) {

    console.error("Reminder error:", error);

  }

});