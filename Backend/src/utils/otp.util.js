function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtml(otp) {
    return `
    <div style="background-color: #f8e38f; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 3px solid #181818; border-radius: 16px; padding: 35px 25px; box-shadow: 8px 8px 0px #181818; color: #181818; box-sizing: border-box;">
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 3px solid #181818;">
          <div style="background-color: #9be3cc; border: 3px solid #181818; border-radius: 30px; display: inline-block; padding: 8px 24px; box-shadow: 3px 3px 0px #181818;">
            <h1 style="color: #181818; margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">
             🎶 Moodify
            </h1>
          </div>
        </div>

        <div style="margin-bottom: 25px; text-align: left;">
          <h2 style="font-size: 26px; font-weight: 900; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: -0.5px; line-height: 1.2;">
            Verify Your Email
          </h2>
          <p style="font-size: 15px; line-height: 1.6; font-weight: 600; margin: 10px 0; color: #181818;">
            Thank you for joining <strong>Moodify</strong>! We're excited to help you find soundtracks that match your emotional state.
          </p>
          <p style="font-size: 15px; line-height: 1.6; font-weight: 600; margin: 10px 0; color: #181818;">
            Please use the following One-Time Password (OTP) to verify your registration:
          </p>
        </div>

        <div style="background-color: #f08ba4; border: 3px solid #181818; border-radius: 16px; padding: 30px 15px; text-align: center; margin: 25px 0; box-shadow: 6px 6px 0px #181818; box-sizing: border-box;">
          <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #181818;">
            Your Verification Code
          </p>
          <div style="background-color: #ffffff; border: 3px solid #181818; border-radius: 8px; display: inline-block; padding: 12px 25px; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #181818; font-family: monospace;">
            ${otp}
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 25px; color: #181818; font-size: 14px; font-weight: 700;">
          <p style="margin: 5px 0;">👌 This OTP is valid for <span style="background-color: #9be3cc; padding: 2px 6px; border: 1.5px solid #181818; border-radius: 4px;">10 minutes</span>.</p>
          <p style="margin: 5px 0; opacity: 0.8;">Please do not share this code with anyone.</p>
        </div>

        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 3px solid #181818;">
          <p style="margin: 5px 0; font-size: 12px; color: rgba(24, 24, 24, 0.6); font-weight: 700;">
            Moodify Platform &copy; 2026. Keep the vibes flowing.
          </p>
        </div>
      </div>
    </div>
    `;
}

module.exports = { generateOtp, getOtpHtml };