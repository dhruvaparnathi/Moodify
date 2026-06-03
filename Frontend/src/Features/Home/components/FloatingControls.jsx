import React from "react";
import { useHome } from "../hooks/useHome";

const FloatingControls = () => {
  const { activeSection, scrollToSection } = useHome();

  return (
    <div className="floating-controls-bottom">
      <button className="pill-btn-left" onClick={() => scrollToSection("section-scanner")}>
        DISCOVER ⚡
      </button>

      <div className="floating-navigator">
        <ul className="nav-items">
          <li
            className={activeSection === "hero" ? "active" : ""}
            onClick={() => scrollToSection("section-hero")}
          >
            Intro
          </li>
          <li
            className={activeSection === "concept" ? "active" : ""}
            onClick={() => scrollToSection("section-concept")}
          >
            Vibe Grid
          </li>
          <li
            className={activeSection === "scanner" ? "active" : ""}
            onClick={() => scrollToSection("section-scanner")}
          >
            AI Scanner
          </li>
          <li
            className={activeSection === "player" ? "active" : ""}
            onClick={() => scrollToSection("section-player")}
          >
            Vibe Player
          </li>
          <li
            className={activeSection === "partners" ? "active" : ""}
            onClick={() => scrollToSection("section-partners")}
          >
            Partners
          </li>
        </ul>
      </div>

      <div className="floating-nav-right-group">
        <div className="mascot-pill" title="Hello Vibe!">
          <div className="mascot-face">
            <span className="eye left"></span>
            <span className="eye right"></span>
            <span className="smile"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingControls;
