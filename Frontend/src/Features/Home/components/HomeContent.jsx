import React, { useEffect } from "react";
import { Navigate } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../../shared/components/Loader";
import { useHome } from "../hooks/useHome";

// Sub-components
import FloatingVinyl from "./FloatingVinyl";
import FloatingNav from "./FloatingNav";
import FloatingControls from "./FloatingControls";
import HeroSection from "./HeroSection";
import ConceptGrid from "./ConceptGrid";
import VibeScanner from "./VibeScanner";
import VibePlayer from "./VibePlayer";
import PartnerTicker from "./PartnerTicker";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const HomeContent = () => {
  const {
    user,
    loading,
    vinylRef,
    activeSection,
    setActiveSection,
    isPlaying,
    currentSong,
    detectedMood,
    getMoodColor,
    scrollToSection
  } = useHome();

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
  }, [loading, user, setActiveSection]);

  // GSAP SCROLLTRIGGER SCROLL-LINKED FLOATING VINYL ANIMATIONS
  useEffect(() => {
    if (loading || !user) return;

    // Reset scroll values on hot reload/mount
    window.scrollTo(0, 0);

    // Initialize vinyl transforms for GPU-accelerated movement
    gsap.set(vinylRef.current, {
      left: 0,
      top: 0,
      xPercent: -50,
      yPercent: -50,
      x: "50vw",
      y: "52vh"
    });

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

    let targetLeft = "77.5vw";
    let targetTop = "44.5vh";

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
      x: "12vw",
      y: "50vh",
      scale: 0.75,
      rotation: 240,
      ease: "power1.inOut"
    })
      .to(vinylRef.current, {
        x: "85vw",
        y: "50vh",
        scale: 0.65,
        rotation: 520,
        ease: "power1.inOut"
      })
      .to(vinylRef.current, {
        x: targetLeft,
        y: targetTop,
        scale: 0.88,
        rotation: 840,
        ease: "power1.inOut"
      })
      .to(vinylRef.current, {
        x: "67vw",
        y: "160vh",
        scale: 0,
        rotation: 1080,
        ease: "power2.in"
      });

    return () => {
      // Clean up all scroll triggers
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loading, user, vinylRef]);

  if (loading) {
    return <Loader text="Syncing audio elements..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="home-page-container">
      {/* Dynamic 5-Section Floating Vinyl Record (Scroll-tied) */}
      <FloatingVinyl ref={vinylRef} />

      {/* Floating Viewport Navigation - Top */}
      <FloatingNav />

      {/* Floating Viewport Controls - Bottom */}
      <FloatingControls />

      {/* Main Scrollytelling Sections Wrap */}
      <div className="scrollytelling-wrapper">
        {/* Section 1: Hero Section */}
        <HeroSection />

        {/* Section 2: Vibe Grid (About Moodify) */}
        <ConceptGrid />

        {/* Section 3: AI Vibe Scanner */}
        <VibeScanner />

        {/* Section 4: Premium Music Player */}
        <VibePlayer />

        {/* Section 5: Loop Partner Ticker */}
        <PartnerTicker />
      </div>
    </div>
  );
};

export default HomeContent;
