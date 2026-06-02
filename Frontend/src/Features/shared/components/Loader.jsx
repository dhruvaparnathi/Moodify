import React from "react";
import "../styles/loader.scss";

const Loader = ({ text = "Tuning into your emotions..." }) => {
  return (
    <div className="loader-container">
      <div className="loader-card-capsule">
        <div className="logo-wrapper">
          {/* Elegant spinning vinyl record mini-mockup */}
          <div className="loader-vinyl-disc">
            <div className="grooves">
              <div className="line l1"></div>
              <div className="line l2"></div>
            </div>
            <div className="sticker">
              <div className="spindle"></div>
            </div>
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
    </div>
  );
};

export default Loader;
