import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const faceLandmarkerRef = useRef(null);
  const runningRef = useRef(false);

  const [expression, setExpression] = useState("Detecting...");

  // Create MediaPipe model
  const createFaceLandmarker = async () => {
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

    startCamera();
  };

  // Start webcam
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = stream;

    videoRef.current.onloadedmetadata = () => {
      videoRef.current.play();
    };
  };

  // Expression analyzer
  const analyzeExpression = (blendshapes) => {
    const getScore = (name) => {
      return (
        blendshapes.find(
          (b) => b.categoryName === name
        )?.score || 0
      );
    };

    const smile =
      getScore("mouthSmileLeft") +
      getScore("mouthSmileRight");

    const blink =
      getScore("eyeBlinkLeft") +
      getScore("eyeBlinkRight");

    const jawOpen = getScore("jawOpen");

    if (smile > 1) {
      setExpression("😊 Smiling");
    } else if (jawOpen > 0.5) {
      setExpression("😮 Mouth Open");
    } else if (blink > 1) {
      setExpression("😉 Blinking");
    } else {
      setExpression("😐 Neutral");
    }
  };

  // Detection loop
  const detect = async () => {
  const video = videoRef.current;

  if (
    video &&
    video.readyState >= 2 &&
    faceLandmarkerRef.current
  ) {
    const results =
      faceLandmarkerRef.current.detectForVideo(
        video,
        performance.now()
      );

    if (
      results.faceBlendshapes &&
      results.faceBlendshapes.length > 0
    ) {
      const blendshapes =
        results.faceBlendshapes[0].categories;

      analyzeExpression(blendshapes);
    }
  }
};

  // Start automatically
  useEffect(() => {
    createFaceLandmarker();

    return () => {
      runningRef.current = false;

      // Stop webcam
      if (videoRef.current?.srcObject) {
        const tracks =
          videoRef.current.srcObject.getTracks();

        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Expression Detection</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "500px",
          borderRadius: "20px",
        }}
      />

      <canvas ref={canvasRef} />

      <h1>{expression}</h1>

      <button onClick={detect}>
        Start Detecting
      </button>
    </div>
  );
};

export default FaceExpression;