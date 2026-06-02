import React, { useEffect, useRef, useState, useCallback } from "react";
import "../styles/home.scss";
import { useNavigate, Navigate } from "react-router";
import {
  Music2,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  User,
  LogOut,
  ChevronDown,
  ArrowUpRight
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FaceExpression from "../../Expression/Components/FaceExpression";
import { useAuth } from "../../Auth/hooks/useAuth";
import Loader from "../../shared/components/Loader";
import { getSongsByMood } from "../services/song.api";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Audio References
  const audioRef = useRef(null);
  const vinylRef = useRef(null);
  const hasScrolledRef = useRef(false);

  // Active section for bottom nav indicator
  const [activeSection, setActiveSection] = useState("hero");

  // Core Playback State
  const [detectedMood, setDetectedMood] = useState("calm");
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);

  // Active webcam scanner trigger
  const [isScanning, setIsScanning] = useState(false);

  // Fetch songs based on mood
  const handleMoodChange = useCallback(async (mood, autoPlay = false) => {
    setIsLoadingSongs(true);
    const fetchedSongs = await getSongsByMood(mood);
    setSongs(fetchedSongs);

    if (fetchedSongs.length > 0) {
      setCurrentSong(fetchedSongs[0]);
      if (autoPlay) {
        setTimeout(() => {
          const audio = audioRef.current;
          if (audio) {
            audio.play().then(() => {
              setIsPlaying(true);
            }).catch(err => console.error("Autoplay failed:", err));
          }
        }, 200);
      }
    } else {
      setCurrentSong(null);
      setIsPlaying(false);
    }
    setIsLoadingSongs(false);
  }, []);

  // AI Webcam Scan completed callback
  const handleScanComplete = useCallback((mood) => {
    if (mood) {
      setDetectedMood((prevMood) => {
        // Only fetch songs and autoplay if the detected mood has actually changed!
        // This ensures the active track continues playing smoothly without interruption.
        if (prevMood !== mood) {
          handleMoodChange(mood, true);
        }
        return mood;
      });

      setIsScanning(false); // Reset scanning trigger state so button unblocks!

      // Auto scroll down to the Player section only on the very first successful scan!
      if (!hasScrolledRef.current) {
        hasScrolledRef.current = true;
        setTimeout(() => {
          scrollToSection("section-player");
        }, 1200);
      }
    }
  }, [handleMoodChange]);

  // AI Webcam Scan error callback
  const handleScanError = useCallback(() => {
    setIsScanning(false);
  }, []);

  // Audio Event Hooks
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => handleNext();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [songs, currentSong]);

  // Audio Handlers
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error("Playback error:", err));
    }
  };

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(false);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.error("Track select failed:", err));
      }
    }, 150);
  };

  const handleNext = () => {
    if (songs.length === 0 || !currentSong) return;
    const currentIndex = songs.findIndex(s => s._id === currentSong._id);
    const nextIndex = (currentIndex + 1) % songs.length;
    handleSelectSong(songs[nextIndex]);
  };

  const handlePrev = () => {
    if (songs.length === 0 || !currentSong) return;
    const currentIndex = songs.findIndex(s => s._id === currentSong._id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    handleSelectSong(songs[prevIndex]);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVol = parseFloat(e.target.value);
    audio.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const handleMuteToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: "😊",
      sad: "😢",
      surprised: "😲",
      surprized: "😲",
      angry: "😠",
      romantic: "😘",
      calm: "😌"
    };
    return emojis[mood] || "😌";
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: "#fbe08d",
      sad: "#a3c9f8",
      surprised: "#fca8cd",
      surprized: "#fca8cd",
      angry: "#f8a2a2",
      romantic: "#fda4af",
      calm: "#9be3cc"
    };
    return colors[mood] || "#9be3cc";
  };

  // Load initial calm songs on mount
  useEffect(() => {
    if (user) {
      handleMoodChange("calm", false);
    }
  }, [user, handleMoodChange]);

  // Scroll to section handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll active section listener (for bottom nav pills)
  useEffect(() => {
    if (loading || !user) return;

    const sections = [
      { id: "section-hero", label: "hero" },
      { id: "section-concept", label: "concept" },
      { id: "section-scanner", label: "scanner" },
      { id: "section-player", label: "player" },
      { id: "section-partners", label: "partners" }
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // triggers when section covers central area
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = sections.find(s => s.id === entry.target.id);
          if (match) {
            setActiveSection(match.label);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading, user]);

  // GSAP SCROLLTRIGGER SCROLL-LINKED FLOATING VINYL ANIMATIONS
  useEffect(() => {
    if (loading || !user) return;

    // Reset scroll values on hot reload/mount
    window.scrollTo(0, 0);

    // Initial load animation for top floating nav and hero elements
    gsap.fromTo(".floating-nav-top",
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: "power4.out" }
    );
    gsap.fromTo(".floating-controls-bottom",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: "power4.out", delay: 0.2 }
    );
    gsap.fromTo(".floating-vinyl-record",
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 1.6, ease: "elastic.out(1, 0.75)" }
    );

    // Measure perfect coordinate anchors for Section 4 turntable slot alignment
    const target = document.querySelector(".turntable-slot-target");
    const section = document.getElementById("section-player");

    let targetLeft = "77.5%";
    let targetTop = "44.5%";

    if (target && section) {
      const targetRect = target.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      // Absolute vertical offset relative to the section top boundary
      const relativeTop = (targetRect.top + targetRect.height / 2) - sectionRect.top;

      // Bind coordinate resolvers
      targetLeft = () => {
        const rect = target.getBoundingClientRect();
        return rect.left + rect.width / 2;
      };

      targetTop = () => {
        return relativeTop;
      };
    }

    // Timeline for Vinyl Record glides across sections (fixed coordinate system)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".home-page-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2, // Smooth scrubbing linking to scrollbar
      }
    });

    // Animate Vinyl across viewport stages
    tl.to(vinylRef.current, {
      left: "12%",
      top: "50%",
      scale: 0.75,
      rotation: 240,
      ease: "power1.inOut"
    })
      .to(vinylRef.current, {
        left: "85%",
        top: "50%",
        scale: 0.65,
        rotation: 520,
        ease: "power1.inOut"
      })
      .to(vinylRef.current, {
        left: targetLeft,
        top: targetTop,
        scale: 0.88,
        rotation: 840,
        ease: "power1.inOut"
      })
      .to(vinylRef.current, {
        left: "67%",
        top: "160%",
        scale: 0,
        // fixed
        // position: "fixed",
        rotation: 1080,
        ease: "power2.in"
      });

    return () => {
      // Clean up all scroll triggers
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loading, user]);

  if (loading) {
    return <Loader text="Syncing audio elements..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="home-page-container">
      {/* Dynamic 5-Section Floating Vinyl Record (Scroll-tied) */}
      <div
        ref={vinylRef}
        className="floating-vinyl-record"
        style={{ left: "50%", top: "52%", transform: "translate(-50%, -50%)" }}
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

      {/* Floating Viewport Navigation - Top */}
      <nav className="floating-nav-top">
        <div className="logo-pill" onClick={() => scrollToSection("section-hero")}>
          <div className="icon-music">
            <Music2 size={16} color="#181818" strokeWidth={3} />
          </div>
          <span>MOODIFY</span>
        </div>

        <div className="user-profile-pill">
          <div className="user-info">
            <User size={14} color="#181818" strokeWidth={2.5} />
            <span>{user.username}</span>
          </div>
          <button onClick={logout} className="logout-btn-pill" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Floating Viewport Controls - Bottom */}
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

      {/* Main Scrollytelling Sections Wrap */}
      <div className="scrollytelling-wrapper">

        {/* Section 1: Hero Section */}
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

        {/* Section 2: Vibe Grid (About Moodify) */}
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

        {/* Section 3: AI Vibe Scanner */}
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

        {/* Section 4: Premium Music Player */}
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
                        <span className="item-artist">Moodify Playlist Artist</span>
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
                <p>{currentSong ? "Moodify Experience Playlist" : "Scan to discover your mood!"}</p>
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

        {/* Section 5: Loop Partner Ticker */}
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

      </div>
    </div>
  );
};

export default Home;