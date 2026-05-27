import React from "react";
import "../styles/notFound.scss";
import { Link } from "react-router";
import { Music2, Home, Headphones } from "lucide-react";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="gradient-one"></div>
      <div className="gradient-two"></div>

      <div className="floating-icons">
        <Music2 className="icon icon1" />
        <Headphones className="icon icon2" />
        <Music2 className="icon icon3" />
      </div>

      <div className="notfound-container">
        <div className="music-wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <h1>404</h1>

        <h2>Oops! Lost In The Vibe</h2>

        <p>
          The page you are looking for doesn’t exist or may have been moved.
          Let Moodify guide you back to the music.
        </p>

        <Link to="/" className="home-btn">
          <Home size={20} />
          Back To Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;