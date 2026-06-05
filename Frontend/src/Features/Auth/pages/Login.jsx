import React, { useState, useEffect } from "react";
import "../styles/login.scss";
import { Link, useNavigate } from "react-router";
import { Music2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Loader from "../../shared/components/Loader";
import { gsap } from "gsap";

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin, handleVerifyEmail, handleResendOtp } = useAuth();

  const [step, setStep] = useState("login"); // "login" or "verify"
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Entrance animations using GSAP
  useEffect(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Initial setups to prevent flashes
    gsap.set(".auth-nav-header, .auth-card, .subheading-badge, .auth-equalizer span, .login-form h2, .login-form p.form-subtitle, .input-group, .forgot-password, .login-btn, .register-link, .auth-mascot-container", {
      opacity: 0
    });

    tl.fromTo(".auth-nav-header",
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0 }
    )
      .fromTo(".auth-card",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.85)" },
        "-=0.7"
      )
      .fromTo(".subheading-badge",
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.8"
      )
      .fromTo(".auth-equalizer span",
        { scaleY: 0.1, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.8, stagger: 0.08, ease: "back.out(1.6)" },
        "-=0.6"
      )
      .fromTo(".login-form h2, .login-form p.form-subtitle, .input-group, .forgot-password, .login-btn, .register-link",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
        "-=0.6"
      )
      .fromTo(".auth-mascot-container",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.0, ease: "back.out(1.5)" },
        "-=0.8"
      );

    // Continuous premium looping equalizer bars
    const barsTween = gsap.to(".auth-equalizer span", {
      scaleY: "random(0.3, 1.8)",
      duration: "random(0.4, 0.7)",
      repeat: -1,
      yoyo: true,
      stagger: 0.08,
      ease: "sine.inOut"
    });

    return () => {
      barsTween.kill();
    };
  }, [loading]);

  if (loading) {
    return <Loader text={step === "login" ? "Logging you in..." : "Verifying code..."} />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage("");
    try {
      const res = await handleLogin(formData);
      if (res && res.unverified) {
        setUnverifiedEmail(formData.email);
        setStep("verify");
      } else if (res && res.success) {
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setErrors(err.response.data.errors.map(e => e.msg));
        } else if (err.response.data.message) {
          setErrors([err.response.data.message]);
        } else {
          setErrors(["Login failed. Please check your credentials."]);
        }
      } else {
        setErrors(["Network error. Please try again later."]);
      }
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage("");
    try {
      await handleVerifyEmail({ email: unverifiedEmail, otp });
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setErrors(err.response.data.errors.map(e => e.msg));
        } else if (err.response.data.message) {
          setErrors([err.response.data.message]);
        } else {
          setErrors(["Verification failed. Please check the code."]);
        }
      } else {
        setErrors(["Network error. Please try again later."]);
      }
    }
  };

  const handleResend = async () => {
    setErrors([]);
    setSuccessMessage("");
    try {
      const data = await handleResendOtp({ email: unverifiedEmail });
      setSuccessMessage(data.message || "OTP resent successfully!");
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setErrors(err.response.data.errors.map(e => e.msg));
        } else if (err.response.data.message) {
          setErrors([err.response.data.message]);
        } else {
          setErrors(["Failed to resend OTP. Please try again."]);
        }
      } else {
        setErrors(["Network error. Please try again later."]);
      }
    }
  };

  return (
    <div className="login-page">
      {/* Floating brand header */}
      <header className="auth-nav-header">
        <div className="logo-pill" onClick={() => navigate("/")}>
          <div className="icon-music">
            <Music2 size={14} color="#181818" strokeWidth={3} />
          </div>
          <span>MOODIFY</span>
        </div>
      </header>

      {/* Centered Auth Card Widget */}
      <div className="auth-card">
        {/* Theme Subheading Badge */}
        <div className="subheading-badge">Authenticate Node</div>

        {/* Animated Equalizer */}
        <div className="auth-equalizer">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Mascot companion floating next to the card */}
        <div className="auth-mascot-container">
          <div className="mascot-pill" title="Hello Vibe!">
            <div className="mascot-face">
              <span className="eye left"></span>
              <span className="eye right"></span>
              <span className="smile"></span>
            </div>
          </div>
          <div className="speech-bubble">
            {step === "login" ? "Welcome back! ⚡" : "Check your inbox! ✉️"}
          </div>
        </div>

        {step === "login" ? (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <p className="form-subtitle">Login to continue your music journey.</p>

            {errors.length > 0 && (
              <div className="error-alert-banner" style={{
                backgroundColor: "#f8a2a2",
                border: "2px solid #181818",
                color: "#181818",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "3px 3px 0px #181818",
                fontSize: "0.9rem",
                fontWeight: "700"
              }}>
                <ul style={{ margin: 0, paddingLeft: "15px" }}>
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group password-group">
              <label>Password</label>

              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="register-link">
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleVerifySubmit}>
            <h2>Verify Email</h2>
            <p className="form-subtitle">Please enter the 6-digit OTP code sent to your email <strong>{unverifiedEmail}</strong>.</p>

            {successMessage && (
              <div className="success-alert-banner" style={{
                backgroundColor: "#9be3cc",
                border: "2px solid #181818",
                color: "#181818",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "3px 3px 0px #181818",
                fontSize: "0.9rem",
                fontWeight: "700"
              }}>
                {successMessage}
              </div>
            )}

            {errors.length > 0 && (
              <div className="error-alert-banner" style={{
                backgroundColor: "#f8a2a2",
                border: "2px solid #181818",
                color: "#181818",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "3px 3px 0px #181818",
                fontSize: "0.9rem",
                fontWeight: "700"
              }}>
                <ul style={{ margin: 0, paddingLeft: "15px" }}>
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="input-group">
              <label>Verification Code</label>
              <input
                type="text"
                name="otp"
                required
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <button type="submit" className="login-btn">
              Verify & Login
            </button>

            <p className="register-link" style={{ marginBottom: "8px" }}>
              Didn't receive the code? <span onClick={handleResend} style={{ color: "#9be3cc", cursor: "pointer", fontWeight: "700", textDecoration: "underline" }}>Resend OTP</span>
            </p>

            <p className="register-link">
              Need to change details? <span onClick={() => { setStep("login"); setErrors([]); setSuccessMessage(""); }} style={{ color: "#f08ba4", cursor: "pointer", fontWeight: "700", textDecoration: "underline" }}>Go Back</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;