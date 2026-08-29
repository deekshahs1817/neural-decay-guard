const twilio = require("twilio");

// Gracefully handle absence of Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const sendReminderSMS = async (mobile, name) => {
  if (!mobile) {
    console.log(`[SMS] Skipping SMS for ${name}: No mobile number.`);
    return;
  }

  const message = `Hi ${name}, you haven't completed today's Neural Decay Guard quiz yet. Finish it before 10 PM to keep your streak alive!`;

  if (client) {
    try {
      await client.messages.create({
        body: message,
        from: twilioNumber,
        to: mobile
      });
      console.log(`[SMS] Reminder sent to ${mobile}`);
    } catch (error) {
      console.error(`[SMS] Failed to send SMS to ${mobile}:`, error.message);
    }
  } else {
    // Fallback if twilio not configured
    console.log(`[SMS MOCK] To: ${mobile} | Message: ${message}`);
  }
};

module.exports = sendReminderSMS;
