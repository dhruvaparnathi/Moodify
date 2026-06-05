function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtml(otp) {
    return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 500px; margin: 20px auto; padding: 30px; border: 3px solid #181818; border-radius: 16px; background-color: #ffffff; box-shadow: 6px 6px 0px #181818; color: #181818;">
      <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 3px solid #181818;">
        <div style="background-color: #fbbf94; border: 2px solid #181818; border-radius: 30px; display: inline-block; padding: 8px 24px;">
          <h1 style="color: #181818; margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            Moodify
          </h1>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: -0.5px;">
          Verify Your Email
        </h2>
        <p style="font-size: 15px; line-height: 1.6; font-weight: 500; margin: 10px 0; color: #181818;">
          Thank you for joining <strong>Moodify</strong>! We're excited to help you find soundtracks that match your emotional state.
        </p>
        <p style="font-size: 15px; line-height: 1.6; font-weight: 500; margin: 10px 0; color: #181818;">
          Please use the following One-Time Password (OTP) to verify your registration:
        </p>
      </div>

      <div style="background-color: #f8e38f; border: 2px solid #181818; border-radius: 12px; padding: 25px 15px; text-align: center; margin: 25px 0; box-shadow: 4px 4px 0px #181818;">
        <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(24, 24, 24, 0.7);">
          Your Verification Code
        </p>
        <h2 style="margin: 0; font-size: 38px; letter-spacing: 10px; font-weight: 800; color: #181818; font-family: monospace;">
          ${otp}
        </h2>
      </div>

      <div style="text-align: center; margin-bottom: 25px; color: rgba(24, 24, 24, 0.7); font-size: 14px; font-weight: 500;">
        <p style="margin: 5px 0;">This OTP is valid for <strong style="color: #181818;">10 minutes</strong>.</p>
        <p style="margin: 5px 0;">Please do not share this code with anyone.</p>
      </div>

      <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 2px solid #181818;">
        <p style="margin: 5px 0; font-size: 13px; color: rgba(24, 24, 24, 0.5); font-weight: 500;">
          Need help? Reach out to us.
        </p>
      </div>
    </div>
    `;
}

module.exports = { generateOtp, getOtpHtml };