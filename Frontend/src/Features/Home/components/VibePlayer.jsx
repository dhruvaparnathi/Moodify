import React from "react";
import { Music, SkipBack, Play, Pause, SkipForward, VolumeX, Volume2 } from "lucide-react";
import Loader from "../../shared/components/Loader";
import { useHome } from "../hooks/useHome";

const VibePlayer = () => {
  const {
    audioRef,
    currentSong,
    isMuted,
    detectedMood,
    getMoodEmoji,
    getMoodColor,
    songs,
    isLoadingSongs,
    isPlaying,
    currentTime,
    duration,
    volume,
    handleSelectSong,
    handlePlayPause,
    handlePrev,
    handleNext,
    handleSeek,
    handleVolumeChange,
    handleMuteToggle,
    formatTime
  } = useHome();

  return (
    <section id="section-player" className="story-section">
      <div className="player-card-layout" style={{ borderBottomColor: getMoodColor(detectedMood) }}>
        {/* Hidden HTML5 Audio Element */}
        {currentSong && (
          <audio
            ref={audioRef}
            src={currentSong.fileUrl}
            muted={isMuted}
          />
        )}

        {/* Left Column: Track List */}
        <div className="player-tracklist-column">
          <div className="column-header">
            <h3>Unlocked Vibe Playlist</h3>
            <span className="tracks-count-badge">
              {detectedMood.toUpperCase()} {getMoodEmoji(detectedMood)} • {songs.length} Tracks
            </span>
          </div>

          {isLoadingSongs ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Loader text="Tuning soundtrack..." />
            </div>
          ) : songs.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.5, gap: "0.5rem" }}>
              <Music size={28} />
              <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>No tracks scanned yet.</p>
              <p style={{ fontSize: "0.72rem", maxWidth: "250px", lineHeight: "1.4" }}>Click "Activate AI Scanner" above to scan your facial mood and unlock matching songs!</p>
            </div>
          ) : (
            <div className="tracklist-scroll">
              {songs.map((song, idx) => (
                <div
                  key={song._id}
                  className={`playlist-item ${currentSong?._id === song._id ? "selected" : ""}`}
                  onClick={() => handleSelectSong(song)}
                >
                  <span className="item-number">{(idx + 1).toString().padStart(2, "0")}</span>
                  <img src={song.posterUrl} className="item-art" alt={song.title} />
                  <div className="item-meta">
                    <span className="item-name">{song.title}</span>
                    <span className="item-artist">{song.artist || "Unknown Artist"}</span>
                  </div>
                  {currentSong?._id === song._id && isPlaying && (
                    <div className="playing-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Player Controls */}
        <div className="player-control-column">
          {/* Turntable Target Slot for Floating Vinyl */}
          <div className="turntable-slot-target">
            <div className="center-spindle-hole"></div>
            <div className="turntable-label-placeholder">
              Turntable Node
            </div>
          </div>

          <div className="active-meta">
            <h4>{currentSong ? currentSong.title : "Ready to Play"}</h4>
            <p>{currentSong ? (currentSong.artist || "Unknown Artist") : "Scan to discover your mood!"}</p>
          </div>

          {/* Progress Slider bar */}
          <div className="time-scrubber">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="scrubber-slider"
              disabled={!currentSong}
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Action Control Buttons */}
          <div className="controls-row">
            <button
              onClick={handlePrev}
              className="btn-skip"
              disabled={songs.length <= 1}
            >
              <SkipBack size={20} color="#181818" strokeWidth={2.5} />
            </button>

            <button
              onClick={handlePlayPause}
              className="btn-play-pause"
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause size={22} color="#181818" strokeWidth={3} />
              ) : (
                <Play size={22} color="#181818" strokeWidth={3} style={{ marginLeft: "3px" }} />
              )}
            </button>

            <button
              onClick={handleNext}
              className="btn-skip"
              disabled={songs.length <= 1}
            >
              <SkipForward size={20} color="#181818" strokeWidth={2.5} />
            </button>
          </div>

          {/* Volume Slider bar */}
          <div className="volume-row">
            <button onClick={handleMuteToggle} className="btn-volume">
              {isMuted || volume === 0 ? (
                <VolumeX size={15} color="#181818" strokeWidth={2.5} />
              ) : (
                <Volume2 size={15} color="#181818" strokeWidth={2.5} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default VibePlayer;
