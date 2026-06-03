import React, { useState, useEffect } from "react";
import "../styles/login.scss";
import { Link, useNavigate } from "react-router";
import { Music2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Loader from "../../shared/components/Loader";
import { gsap } from "gsap";

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();

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
    gsap.set(".left-section .brand, .left-section h2, .left-section p, .music-bars span, .right-section, .login-form h2, .login-form p, .input-group, .forgot-password, .login-btn, .register-link", {
      opacity: 0
    });

    tl.fromTo(".left-section .brand",
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }
    )
      .fromTo(".left-section h2",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        "-=0.7"
      )
      .fromTo(".left-section p",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        "-=0.7"
      )
      .fromTo(".music-bars span",
        { scaleY: 0.1, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.9, stagger: 0.1, ease: "back.out(1.6)" },
        "-=0.6"
      )
      .fromTo(".right-section",
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 },
        "-=0.9"
      )
      .fromTo(".login-form h2, .login-form p, .input-group, .forgot-password, .login-btn, .register-link",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
        "-=0.7"
      );

    // Continuous premium looping equalizer bars
    const barsTween = gsap.to(".music-bars span", {
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
    return <Loader text="Logging you in..." />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(formData);
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-container">
        <div className="left-section">
          <div className="brand">
            <Music2 size={34} />
            <h1>Moodify</h1>
          </div>

          <h2>Feel the music
            <br />
            through emotions.
          </h2>

          <p>
            AI-powered mood detection meets personalized music experience.
          </p>

          <div className="music-bars">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="right-section">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <p>Login to continue your music journey.</p>

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
        </div>
      </div>
    </div>
  );
};

export default Login;