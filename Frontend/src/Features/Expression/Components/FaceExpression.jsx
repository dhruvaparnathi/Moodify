import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import "../styles/faceExpression.scss";

const FaceExpression = ({ isScanning, onScanComplete, onScanError }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const faceLandmarkerRef = useRef(null);
  const runningRef = useRef(false);
  const streamRef = useRef(null);
  const scanTimerRef = useRef(null);

  // Aggregation of scores during active scanning
  const scoreAccumulatorRef = useRef({
    happy: 0,
    sad: 0,
    surprized: 0,
    angry: 0,
    romantic: 0,
    calm: 0,
  });

  const [scanStatus, _setScanStatus] = useState("idle"); // idle, starting, ready, scanning
  const scanStatusRef = useRef("idle");

  const setScanStatus = (status) => {
    scanStatusRef.current = status;
    _setScanStatus(status);
  };

  const [dominantEmotion, setDominantEmotion] = useState("calm");
  const [dominantLabel, setDominantLabel] = useState("Calm 😌");

  // Create MediaPipe model
  const createFaceLandmarker = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const landmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          outputFacialTransformationMatrixes: true,
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );

      faceLandmarkerRef.current = landmarker;
    } catch (error) {
      console.error("Failed to initialize Face Landmarker:", error);
      setScanStatus("error");
      setDominantLabel("Model Load Error ❌");
      if (typeof onScanError === "function") {
        onScanError();
      }
    }
  };

  // Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            runningRef.current = true;
            setScanStatus("ready"); // Automatically active and showing live feed
            requestAnimationFrame(detect);
          }
        };
      }
    } catch (error) {
      console.error("Error opening webcam:", error);
      setScanStatus("error");
      setDominantLabel("Camera Access Denied ❌");
      if (typeof onScanError === "function") {
        onScanError();
      }
    }
  };

  // Run a single 2.2-second scan interval when triggered by button
  const startScanTimer = () => {
    scoreAccumulatorRef.current = {
      happy: 0,
      sad: 0,
      surprized: 0,
      angry: 0,
      romantic: 0,
      calm: 0,
    };

    setScanStatus("scanning"); // Turn on scanning overlay / scanning line

    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(() => {
      reportScanResultAndFinish();
    }, 2200);
  };

  // Compile expression, trigger parent update, and return camera to ready state
  const reportScanResultAndFinish = () => {
    if (!runningRef.current) return;

    const peaks = scoreAccumulatorRef.current;
    console.log("Webcam scan finished. Measured peaks:", peaks);

    let finalDominant = "calm";
    let highestActiveScore = -1;
    let activeDetected = false;

    // We track active precedence: if any active emotion peaks above a calibrated 22% threshold,
    // we choose the highest active emotion. Otherwise, we default to "calm" to avoid calm dominance.
    const activeEmotions = ["happy", "sad", "surprized", "angry", "romantic"];
    activeEmotions.forEach((emo) => {
      if (peaks[emo] >= 22 && peaks[emo] > highestActiveScore) {
        highestActiveScore = peaks[emo];
        finalDominant = emo;
        activeDetected = true;
      }
    });

    if (!activeDetected) {
      finalDominant = "calm";
    }

    console.log(`Resolved dominant emotion: "${finalDominant}" (Active detected: ${activeDetected}, Peak score: ${activeDetected ? highestActiveScore : peaks.calm}%)`);

    const labels = {
      happy: "Happy 😊",
      sad: "Sad 😢",
      surprized: "Surprised 😲",
      angry: "Angry 😠",
      romantic: "Romantic 😘",
      calm: "Calm 😌",
    };

    setDominantEmotion(finalDominant);
    setDominantLabel(labels[finalDominant]);
    setScanStatus("ready"); // Go back to ready live feed, stopping scan lines

    if (typeof onScanComplete === "function") {
      onScanComplete(finalDominant);
    }
  };

  // Expression analyzer using ARKit 52 blendshapes mapping
  const analyzeExpression = (blendshapes) => {
    const getScore = (name) => {
      return (
        blendshapes.find(
          (b) => b.categoryName === name
        )?.score || 0
      );
    };

    // 1. HAPPY
    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");
    const cheekSquintLeft = getScore("cheekSquintLeft");
    const cheekSquintRight = getScore("cheekSquintRight");
    const happyRaw = ((smileLeft + smileRight) / 2) * 0.8 + ((cheekSquintLeft + cheekSquintRight) / 2) * 0.2;
    const happyScore = Math.min(100, Math.round(happyRaw * 100));

    // 2. SAD
    const mouthFrownLeft = getScore("mouthFrownLeft");
    const mouthFrownRight = getScore("mouthFrownRight");
    const browInnerUp = getScore("browInnerUp");
    const mouthShrugLower = getScore("mouthShrugLower");
    const mouthShrugUpper = getScore("mouthShrugUpper");
    const sadRaw = ((mouthFrownLeft + mouthFrownRight) / 2) * 0.4 + browInnerUp * 0.35 + ((mouthShrugLower + mouthShrugUpper) / 2) * 0.25;
    const sadScore = Math.min(100, Math.round(sadRaw * 100));

    // 3. SURPRISED
    const eyeWideLeft = getScore("eyeWideLeft");
    const eyeWideRight = getScore("eyeWideRight");
    const jawOpen = getScore("jawOpen");
    const surprisedRaw = ((eyeWideLeft + eyeWideRight) / 2) * 0.35 + jawOpen * 0.4 + browInnerUp * 0.25;
    const surprisedScore = Math.min(100, Math.round(surprisedRaw * 100));

    // 4. ANGRY
    const browDownLeft = getScore("browDownLeft");
    const browDownRight = getScore("browDownRight");
    const noseSneerLeft = getScore("noseSneerLeft");
    const noseSneerRight = getScore("noseSneerRight");
    const mouthPressLeft = getScore("mouthPressLeft");
    const mouthPressRight = getScore("mouthPressRight");
    const angryRaw = ((browDownLeft + browDownRight) / 2) * 0.5 + ((noseSneerLeft + noseSneerRight) / 2) * 0.3 + ((mouthPressLeft + mouthPressRight) / 2) * 0.2;
    const angryScore = Math.min(100, Math.round(angryRaw * 100));

    // 5. ROMANTIC
    const squintLeft = getScore("eyeSquintLeft");
    const squintRight = getScore("eyeSquintRight");
    const dimpleLeft = getScore("mouthDimpleLeft");
    const dimpleRight = getScore("mouthDimpleRight");
    const blinkLeft = getScore("eyeBlinkLeft");
    const blinkRight = getScore("eyeBlinkRight");
    
    const avgSmile = (smileLeft + smileRight) / 2;
    const warmSmileFactor = avgSmile > 0.1 && avgSmile < 0.6 ? (1.0 - Math.abs(avgSmile - 0.35) * 2.2) : 0;
    const avgSquint = (squintLeft + squintRight) / 2;
    const avgDimple = (dimpleLeft + dimpleRight) / 2;
    const winkLeft = (blinkLeft > 0.45 && blinkRight < 0.2) ? 0.7 : 0;
    const winkRight = (blinkRight > 0.45 && blinkLeft < 0.2) ? 0.7 : 0;
    const isWinking = Math.max(winkLeft, winkRight);

    const romanticRaw = (warmSmileFactor * 0.35 + avgSquint * 0.3 + avgDimple * 0.15) + isWinking * 0.2;
    const romanticScore = Math.min(100, Math.round(romanticRaw * 100));

    // 6. CALM
    const tension = ((smileLeft + smileRight) / 2) * 0.3 + 
                    ((mouthFrownLeft + mouthFrownRight) / 2) * 0.4 + 
                    browInnerUp * 0.3 + 
                    ((browDownLeft + browDownRight) / 2) * 0.4 + 
                    jawOpen * 0.5 + 
                    ((eyeWideLeft + eyeWideRight) / 2) * 0.4 + 
                    ((squintLeft + squintRight) / 2) * 0.2;
    const calmRaw = Math.max(0, 1.0 - tension * 1.4);
    const calmScore = Math.min(100, Math.round(calmRaw * 100));

    // Track the peak (maximum) score for each emotion during the scan window
    scoreAccumulatorRef.current.happy = Math.max(scoreAccumulatorRef.current.happy, happyScore);
    scoreAccumulatorRef.current.sad = Math.max(scoreAccumulatorRef.current.sad, sadScore);
    scoreAccumulatorRef.current.surprized = Math.max(scoreAccumulatorRef.current.surprized, surprisedScore);
    scoreAccumulatorRef.current.angry = Math.max(scoreAccumulatorRef.current.angry, angryScore);
    scoreAccumulatorRef.current.romantic = Math.max(scoreAccumulatorRef.current.romantic, romanticScore);
    scoreAccumulatorRef.current.calm = Math.max(scoreAccumulatorRef.current.calm, calmScore);
  };

  // Detection loop
  const detect = async () => {
    if (!runningRef.current) return;

    const video = videoRef.current;
    if (
      video &&
      video.readyState >= 2 &&
      faceLandmarkerRef.current
    ) {
      try {
        const results = faceLandmarkerRef.current.detectForVideo(
          video,
          performance.now()
        );

        if (
          scanStatusRef.current === "scanning" &&
          results.faceBlendshapes &&
          results.faceBlendshapes.length > 0
        ) {
          const blendshapes = results.faceBlendshapes[0].categories;
          analyzeExpression(blendshapes);
        }
      } catch (err) {
        console.error("Error detecting face landmarks:", err);
      }
    }

    if (runningRef.current) {
      requestAnimationFrame(detect);
    }
  };

  // Load MediaPipe model and start camera automatically on mount
  useEffect(() => {
    createFaceLandmarker().then(() => {
      startCamera();
    });

    return () => {
      runningRef.current = false;
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Listen to scanner active triggers from parent
  useEffect(() => {
    if (isScanning && runningRef.current) {
      startScanTimer();
    }
  }, [isScanning]);

  const getEmotionColor = (emo) => {
    switch (emo) {
      case "happy": return "#fbbf24";
      case "sad": return "#3b82f6";
      case "surprized": return "#ec4899";
      case "angry": return "#ef4444";
      case "romantic": return "#f43f5e";
      case "calm": return "#10b981";
      default: return "#8b5cf6";
    }
  };

  return (
    <div className="scanner-container">
      {/* Dynamic Aspect-Ratio Webcam Scanner */}
      <div className={`video-wrapper ${scanStatus === "scanning" ? "scanning-active" : ""} ${dominantEmotion}`}>
        {scanStatus === "starting" && (
          <div className="scanner-overlay standby">
            <span className="spinner"></span>
            <p>Initializing AI Scanner...</p>
          </div>
        )}

        {scanStatus === "idle" && (
          <div className="scanner-overlay standby">
            <div className="scanner-graphic">
              <span className="pulse-circle"></span>
              <span className="core-dot"></span>
            </div>
            <p className="scanner-status-text">Webcam Inactive</p>
            <p className="scanner-instruction">Click "Detect My Vibe" to scan</p>
          </div>
        )}

        {/* Video feed remains physically present but conditional styled */}
        <video
          ref={videoRef}
          className={`webcam-video ${(scanStatus === "scanning" || scanStatus === "ready") ? "visible" : "hidden"}`}
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        
        {/* Dynamic color-synced scan line */}
        {scanStatus === "scanning" && (
          <div 
            className="scan-line" 
            style={{
              background: `linear-gradient(90deg, transparent, ${getEmotionColor(dominantEmotion)}, transparent)`,
              boxShadow: `0 0 12px ${getEmotionColor(dominantEmotion)}`
            }}
          />
        )}
      </div>

      {/* Centered dominant vibe badge */}
      {(scanStatus === "scanning" || scanStatus === "ready") && dominantEmotion && (
        <div className="emotion-badge-container animate-fade-in">
          <div className={`dominant-emotion-badge ${dominantEmotion}`}>
            Vibe Detected: {dominantLabel}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceExpression;