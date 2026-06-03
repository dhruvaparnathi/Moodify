import React from "react";

const ConceptGrid = () => {
  return (
    <section id="section-concept" className="story-section">
      <div className="concept-container">
        <div className="section-intro-text">
          <h2>But what is it actually?</h2>
          <p>
            Moodify reads your facial micro-expressions using advanced neural blendshape analysis, mapping them dynamically into six core emotional sonic states.
          </p>
        </div>

        <div className="mood-grid">
          <div className="mood-card happy">
            <div className="mood-emoji-box">😊</div>
            <h3>Happy</h3>
            <p>Uplifting beats, high-energy pop, and bright melodies designed to match your smiling frequency.</p>
          </div>

          <div className="mood-card sad">
            <div className="mood-emoji-box">😢</div>
            <h3>Sad</h3>
            <p>Gentle acoustics, soft melancholic strings, and warm comforting chords for deep reflective listening.</p>
          </div>

          <div className="mood-card surprised">
            <div className="mood-emoji-box">😲</div>
            <h3>Surprised</h3>
            <p>Eclectic experimental syncopation, unexpected drops, and cosmic synth hooks to spark your curiosity.</p>
          </div>

          <div className="mood-card angry">
            <div className="mood-emoji-box">😠</div>
            <h3>Angry</h3>
            <p>Heavy driving basslines, intense punk rock rhythms, and raw guitars for cathartic sonic release.</p>
          </div>

          <div className="mood-card calm">
            <div className="mood-emoji-box">😌</div>
            <h3>Calm</h3>
            <p>Zen ambient lofi pads, peaceful nature sound beds, and soothing minimalist melodies.</p>
          </div>

          <div className="mood-card romantic">
            <div className="mood-emoji-box">😘</div>
            <h3>Romantic</h3>
            <p>Dreamy R&B rhythms, soulful warm keys, and lush indie love ballads to set the perfect cozy space.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptGrid;
