import React from "react";
import { ChevronDown } from "lucide-react";
import { useHome } from "../hooks/useHome";

const HeroSection = () => {
  const { scrollToSection } = useHome();

  return (
    <section id="section-hero" className="story-section">
      <div className="hero-text-container">
        <div className="subheading-badge">
          Feel Your Emotions
        </div>

        <h1 className="giant-headline">
          <span className="row">Music is</span>
          <span className="row row-middle">
            <span>merging</span>
            {/* Large visual gap for the floating vinyl record to nest on initial load */}
            <span>with</span>
          </span>
          <span className="row">your emotions</span>
        </h1>

        <div className="scroll-hint-badge" onClick={() => scrollToSection("section-concept")}>
          <span>Scroll to dive</span>
          <ChevronDown size={14} strokeWidth={3} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
