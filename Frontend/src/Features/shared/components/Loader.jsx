import React from "react";
import { Music2 } from "lucide-react";
import "../styles/loader.scss";

const Loader = ({ text = "Tuning into your emotions..." }) => {
  return (
    <div className="loader-container">
      <div className="glow-effect"></div>
      
      <div className="logo-wrapper">
        <div className="pulse-ring"></div>
        <div className="icon-container">
          <Music2 size={64} strokeWidth={1.5} />
        </div>
      </div>

      <p className="loading-text">{text}</p>

      <div className="music-wave">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Loader;
