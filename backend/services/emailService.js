const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deekshahs1817@gmail.com",
    pass: "vuhslyduqijslhps"
  }
});

const sendReminderEmail = async (email, name) => {

  const mailOptions = {
    from: "YOUR_EMAIL@gmail.com",
    to: email,
    subject: "Don't Break Your Quiz Streak!",
    text: `Hi ${name}, you haven't completed today's quiz yet. Finish it before 10 PM to keep your streak alive!`
  };

  await transporter.sendMail(mailOptions);

};

module.exports = sendReminderEmail;