import React from "react";
import { useHome } from "../hooks/useHome";

const FloatingVinyl = () => {
  const { vinylRef, isPlaying, currentSong, detectedMood, getMoodColor } = useHome();

  return (
    <div
      ref={vinylRef}
      className="floating-vinyl-record"
      style={{ left: 0, top: 0, transform: "translate3d(50vw, 52vh, 0) translate(-50%, -50%)" }}
    >
      <div className={`vinyl-disc-rotate-wrapper ${isPlaying ? "playing" : ""}`}>
        <div className="vinyl-grooves">
          <div className="vinyl-groove-line line-1"></div>
          <div className="vinyl-groove-line line-2"></div>
          <div className="vinyl-groove-line line-3"></div>
        </div>
        <div
          className="vinyl-sticker"
          style={{
            backgroundImage: currentSong ? `url(${currentSong.posterUrl})` : "none",
            backgroundColor: getMoodColor(detectedMood)
          }}
        >
          <div className="vinyl-sticker-inner">
            <div className="vinyl-spindle"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingVinyl;
