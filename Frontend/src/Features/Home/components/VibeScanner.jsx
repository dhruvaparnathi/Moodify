import React from "react";
import { Sparkles } from "lucide-react";
import FaceExpression from "../../Expression/Components/FaceExpression";
import { useHome } from "../hooks/useHome";

const VibeScanner = () => {
  const { isScanning, setIsScanning, handleScanComplete, handleScanError } = useHome();

  return (
    <section id="section-scanner" className="story-section">
      <div className="scanner-card-layout">
        <div className="scanner-description-side">
          <div className="section-badge">AI Scanner Node</div>
          <h2>Capture Your Vibe</h2>
          <p>
            Activate our advanced AI biometric visual scanner. In two seconds, our neural blendshape processor scans your facial geometry, maps micro-tensions, and unlocks custom matching musical soundtracks.
          </p>

          <button
            className="activate-scanner-pill-btn"
            onClick={() => setIsScanning(true)}
            disabled={isScanning}
          >
            <Sparkles size={16} strokeWidth={2.5} />
            <span>{isScanning ? "Scanning Vibe..." : "Activate AI Scanner ⚡"}</span>
          </button>

          <div className="manual-vibe-fallback">
            <p className="fallback-title">Or pick your vibe manually:</p>
            <div className="fallback-pills">
              <span className="vibe-pill happy" onClick={() => handleScanComplete("happy")}>Happy 😊</span>
              <span className="vibe-pill sad" onClick={() => handleScanComplete("sad")}>Sad 😢</span>
              <span className="vibe-pill surprised" onClick={() => handleScanComplete("surprised")}>Surprised 😲</span>
              <span className="vibe-pill angry" onClick={() => handleScanComplete("angry")}>Angry 😠</span>
              <span className="vibe-pill calm" onClick={() => handleScanComplete("calm")}>Calm 😌</span>
              <span className="vibe-pill romantic" onClick={() => handleScanComplete("romantic")}>Romantic 😘</span>
            </div>
          </div>
        </div>

        <div className="scanner-camera-side">
          <div className="scanner-viewfinder-portal">
            <FaceExpression 
              isScanning={isScanning} 
              onScanComplete={handleScanComplete} 
              onScanError={handleScanError}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VibeScanner;
