require('dotenv').config();
const authConfig = require('../config/authConfig');

const axios = require("axios");

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
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Moodify",
          email: authConfig.BREVO_SENDER,
        },
        to: [{ email: to }],
        subject,
        htmlContent: emailHtml,
        textContent: emailText,
      },
      {
        headers: {
          "api-key": authConfig.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Brevo Email Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { sendEmail };