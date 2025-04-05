"use client";

import { useRef, useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { useSmile } from "@/Context/SmileContext";

export function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const { setIsSmiling } = useSmile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getContext = (): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext("2d") : null;
  };
  // Utility function: Calculate distance between two points (Euclidean distance)
  function distance(
    pt1: { x: number; y: number },
    pt2: { x: number; y: number }
  ): number {
    const dx = pt1.x - pt2.x;
    const dy = pt1.y - pt2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function detectSmile(points: Array<{ x: number; y: number }>): boolean {
    // 1. Calculate the aspect ratio of left and right eyes (Eye Aspect Ratio)
    const leftEyeVert = distance(points[159], points[145]); // Distance between upper and lower eyelids of left eye
    const leftEyeHoriz = distance(points[33], points[133]); // Distance between left and right corners of left eye
    const rightEyeVert = distance(points[386], points[374]); // Distance between upper and lower eyelids of right eye
    const rightEyeHoriz = distance(points[362], points[263]); // Distance between left and right corners of right eye

    const leftEAR = leftEyeVert / leftEyeHoriz;
    const rightEAR = rightEyeVert / rightEyeHoriz;
    const eyeAspectRatio = (leftEAR + rightEAR) / 2; // Average of left and right

    // 2. Calculate the upward curve of mouth corners (using point [13] at the center of the mouth as a reference)
    const baseY = points[13].y; // Y-coordinate of the reference point near the center of the mouth (point [13])
    const leftCornerY = points[61].y; // Y-coordinate of left mouth corner
    const rightCornerY = points[291].y; // Y-coordinate of right mouth corner

    // Relative upward curve of mouth corners from the reference point
    const leftCornerRise = baseY - leftCornerY;
    const rightCornerRise = baseY - rightCornerY;
    // Use the smaller of the two values or their average
    const cornerRise = Math.min(leftCornerRise, rightCornerRise) * 100;

    // 3. Calculate the mouth opening ratio (ratio of vertical distance to horizontal width)
    // If exact points for upper and lower lips are unknown, use points[0] and points[17] as placeholders
    const mouthTopY = points[0].y; // Representative point for upper lip (e.g., point 0)
    const mouthBottomY = points[17].y; // Representative point for lower lip (e.g., point 17)
    const mouthVertical = Math.abs(mouthBottomY - mouthTopY); // Vertical opening of mouth
    const mouthHorizontal = distance(points[61], points[291]); // Width of mouth (distance between corners)
    const mouthAspectRatio = mouthVertical / mouthHorizontal; // Aspect ratio (MAR)

    // 4. Set thresholds (adjustable parameters)
    const EYE_AR_THRESHOLD = 0.4; // Eye aspect ratio below this value indicates squinting eyes
    const CORNER_RISE_THRESHOLD = 0.4; // Mouth corner rise above this value indicates upturned corners
    const MOUTH_AR_THRESHOLD = 0.7; // Mouth aspect ratio above this value indicates open mouth
    console.log("eyeAspectRatio", eyeAspectRatio);
    console.log("cornerRise", cornerRise);
    console.log("mouthAspectRatio", mouthAspectRatio);
    // 5. Check if all conditions are met
    console.log(
      eyeAspectRatio < EYE_AR_THRESHOLD,
      cornerRise > CORNER_RISE_THRESHOLD,
      mouthAspectRatio > MOUTH_AR_THRESHOLD
    );
    if (
      eyeAspectRatio < EYE_AR_THRESHOLD &&
      cornerRise > CORNER_RISE_THRESHOLD &&
      mouthAspectRatio > MOUTH_AR_THRESHOLD
    ) {
      return true; // Identified as smiling
    } else {
      return false; // Not smiling
    }
  }

  useEffect(() => {
    if (!isClient) return;

    const setupFaceMesh = async () => {
      try {
        const { FaceMesh, FACEMESH_TESSELATION } = await import(
          "@mediapipe/face_mesh"
        );
        const { Camera } = await import("@mediapipe/camera_utils");
        const { drawConnectors } = await import("@mediapipe/drawing_utils");

        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          const points = results.multiFaceLandmarks[0];
          const videoElement = videoRef.current;
          const canvasElement = canvasRef.current;

          if (!canvasElement || !videoElement || !points) return;

          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;

          const canvasCtx = getContext();
          if (!canvasCtx) return;

          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          // 笑顔検出
          const smiling = detectSmile(points);
          setIsSmiling(smiling);

          // メッシュの描画
          drawConnectors(canvasCtx, points, FACEMESH_TESSELATION, {
            color: smiling ? "#00FF0070" : "#C0C0C070", // 笑顔のときは緑色に
            lineWidth: 1,
          });

          // 笑顔検出時のテキスト表示
          if (smiling) {
            canvasCtx.font = "30px Arial";
            canvasCtx.fillStyle = "#00FF00";
            canvasCtx.fillText("😊 Smiling!", 20, 40);
          }

          canvasCtx.restore();
        });

        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current) {
                await faceMesh.send({ image: videoRef.current });
              }
            },
            width: 1280,
            height: 720,
          });
          camera.start();
        }
      } catch (error) {
        console.error("Error setting up FaceMesh:", error);
      }
    };

    setupFaceMesh();
  }, [isClient]);

  if (!isClient) return null;

  return (
    <CardContent className="p-0 relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover absolute top-0 left-0"
      />
    </CardContent>
  );
}
