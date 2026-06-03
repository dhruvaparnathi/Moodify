import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import { getSongsByMood } from "../services/song.api";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const { user, loading, logout } = useAuth();

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
        if (prevMood !== mood) {
          handleMoodChange(mood, true);
        }
        return mood;
      });

      setIsScanning(false);

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

  return (
    <HomeContext.Provider
      value={{
        user,
        loading,
        logout,
        audioRef,
        vinylRef,
        activeSection,
        setActiveSection,
        detectedMood,
        songs,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isLoadingSongs,
        isScanning,
        setIsScanning,
        handleMoodChange,
        handleScanComplete,
        handleScanError,
        handlePlayPause,
        handleSelectSong,
        handlePrev,
        handleNext,
        handleSeek,
        handleVolumeChange,
        handleMuteToggle,
        formatTime,
        getMoodEmoji,
        getMoodColor,
        scrollToSection
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
