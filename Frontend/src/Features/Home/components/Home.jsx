import React, { useEffect } from "react";
import '../styles/home.scss';
import { Link, useNavigate, Navigate } from "react-router";
import {
  Music2,
  Sparkles,
  AudioWaveform,
  BrainCircuit,
} from "lucide-react";

import FaceExpression from '../../Expression/Components/FaceExpression';
import { useAuth } from "../../Auth/hooks/useAuth";
import Loader from "../../shared/components/Loader";

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <Loader text="Tuning into your emotions..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  

  return (
    <div className="home-page">
      <div className="gradient gradient-one"></div>
      <div className="gradient gradient-two"></div>

      <nav className="navbar">
        <div className="logo">
          <Music2 size={30} />
          <h1>Moodify</h1>
        </div>

        {
        user ? '' : <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>
        }
      </nav>

      <section className="hero-section">
        <div className="left-content">
          <div className="badge">
            <Sparkles size={16} />
            AI Emotion Based Music Recommendation
          </div>

          <h1>
            Feel Your
            <span> Music </span>
            Through Emotions.
          </h1>

          <p>
            Moodify uses AI-powered face expression detection to understand
            your emotions and instantly recommend songs that match your vibe.
          </p>


          <div className="features">
            <div className="feature-card">
              <BrainCircuit size={24} />
              <span>AI Detection</span>
            </div>

            <div className="feature-card">
              <AudioWaveform size={24} />
              <span>Music Matching</span>
            </div>
          </div>
          <div className="hero-buttons">
            <button className="primary-btn">Start Detecting</button>

            {/* <button className="secondary-btn">
              Explore Features
            </button> */}
          </div>
        </div>

        <div className="right-content">
          <div className="camera-card">
            <div className="card-header">
              <div className="live-dot"></div>
              <p>Live Expression Scanner</p>
            </div>

            <FaceExpression />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;