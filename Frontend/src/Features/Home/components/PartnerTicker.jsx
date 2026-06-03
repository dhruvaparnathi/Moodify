import React from "react";

const PartnerTicker = () => {
  return (
    <section id="section-partners" className="story-section">
      <div className="ticker-heading">Sound Partners - Demo</div>

      <div className="ticker-wrap">
        <div className="ticker-track">
          {/* Double looping nodes for infinite sliding animation */}
          <div className="partner-logo-item">Spotify</div>
          <div className="partner-logo-item">SoundCloud</div>
          <div className="partner-logo-item">Apple Music</div>
          <div className="partner-logo-item">YouTube Music</div>
          <div className="partner-logo-item">Tidal</div>
          <div className="partner-logo-item">Deezer</div>

          {/* Loop clone */}
          <div className="partner-logo-item">Spotify</div>
          <div className="partner-logo-item">SoundCloud</div>
          <div className="partner-logo-item">Apple Music</div>
          <div className="partner-logo-item">YouTube Music</div>
          <div className="partner-logo-item">Tidal</div>
          <div className="partner-logo-item">Deezer</div>
        </div>
      </div>
    </section>
  );
};

export default PartnerTicker;
