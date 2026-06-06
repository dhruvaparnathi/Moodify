require('dotenv').config();
const nodemailer = require("nodemailer");
const authConfig = require('../config/authConfig');

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: authConfig.BREVO_LOGIN,
    pass: authConfig.BREVO_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to Brevo SMTP:", error);
  } else {
    console.log("Brevo SMTP server is ready to send emails");
  }
});

const sendEmail = async (to, subject, text, html) => {
  let emailText = text;
  let emailHtml = html;

  if (html === undefined) {
    if (text && (text.includes('<html') || text.includes('<div') || text.includes('</') || text.includes('<p>'))) {
      emailHtml = text;
      // Strip HTML tags for a clean plaintext fallback text
      emailText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
  }

  try {
    const info = await transporter.sendMail({
      from: `"Moodify" <${authConfig.BREVO_SENDER}>`,
      to,
      subject,
      text: emailText,
      html: emailHtml,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };