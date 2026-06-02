import React, { useState, useEffect } from "react";
import '../styles/register.scss'
import { useAuth } from "../hooks/useAuth";
import Loader from "../../shared/components/Loader";
import { useNavigate, Link } from "react-router";
import { Music2, Eye, EyeOff } from "lucide-react";
import { gsap } from "gsap";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Entrance animations using GSAP
  useEffect(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Initial setups to prevent flashes
    gsap.set(".left-section .brand, .left-section h2, .left-section p, .music-bars span, .right-section, .register-form h2, .register-form p, .input-group, .register-btn, .login-link", {
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
    .fromTo(".register-form h2, .register-form p, .input-group, .register-btn, .login-link", 
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
    return <Loader text="Creating your Account..." />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(formData);
    navigate('/');
  };

  return (
    <div className="register-page">
      <div className="overlay"></div>

      <div className="register-container">
        <div className="left-section">
          <div className="brand">
            <Music2 size={34} />
            <h1>Moodify</h1>
          </div>

          <h2>Your mood.
            <br />
            Your music.
          </h2>

          <p>
            Detect emotions through facial expressions and discover songs
            that perfectly match your vibe.
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
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <p>Join Moodify and start your emotion-driven playlist journey.</p>

            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                required
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

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

            <button type="submit" className="register-btn">
              Create Account
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;