import React, { useState } from "react";
import "../styles/login.scss";
import { Link, useNavigate } from "react-router";
import { Music2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth"
import Loader from "../../shared/components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if(loading){
    return <Loader text="Logging you in..." />;
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async(e) => {
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

            {/* <div className="divider">
              <span></span>
              <p>or</p>
              <span></span>
            </div>

            <button type="button" className="google-btn">
              Continue with Google
            </button> */}

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