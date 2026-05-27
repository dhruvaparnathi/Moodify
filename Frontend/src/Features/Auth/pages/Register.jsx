import React, { useState } from "react";
import '../styles/register.scss'
import { useAuth } from "../hooks/useAuth";
import Loader from "../../shared/components/Loader";
import { useNavigate, Link } from "react-router";
import { Music2, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  if(loading){
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

            {/* <div className="divider">
              <span></span>
              <p>or</p>
              <span></span>
            </div> */}

            {/* <button type="button" className="google-btn">
              Continue with Google
            </button> */}

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