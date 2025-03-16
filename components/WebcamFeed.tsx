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
  // ユーティリティ関数: 2点間の距離を計算（ユークリッド距離）
  function distance(
    pt1: { x: number; y: number },
    pt2: { x: number; y: number }
  ): number {
    const dx = pt1.x - pt2.x;
    const dy = pt1.y - pt2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function detectSmile(points: Array<{ x: number; y: number }>): boolean {
    // 1. 左右の目の縦横比（Eye Aspect Ratio）の計算
    const leftEyeVert = distance(points[159], points[145]); // 左目の上下（まぶた間）の距離
    const leftEyeHoriz = distance(points[33], points[133]); // 左目の左右（目尻間）の距離
    const rightEyeVert = distance(points[386], points[374]); // 右目の上下の距離
    const rightEyeHoriz = distance(points[362], points[263]); // 右目の左右の距離

    const leftEAR = leftEyeVert / leftEyeHoriz;
    const rightEAR = rightEyeVert / rightEyeHoriz;
    const eyeAspectRatio = (leftEAR + rightEAR) / 2; // 左右の平均を使用

    // 2. 口角の上がり具合の計算（口の中心点[13]を基準に口角の高さを見る）
    const baseY = points[13].y; // 基準として口の中心あたりのポイント（[13]）のY座標
    const leftCornerY = points[61].y; // 左口角のY座標
    const rightCornerY = points[291].y; // 右口角のY座標

    // 口角の基準点からの相対的な上がり量
    const leftCornerRise = baseY - leftCornerY;
    const rightCornerRise = baseY - rightCornerY;
    // 左右どちらか小さい方を採用してもよいし、平均してもよい
    const cornerRise = Math.min(leftCornerRise, rightCornerRise)  *100;

    // 3. 口の開き具合の計算（上下の唇の距離と口幅の比率）
    // ※上唇と下唇の代表点が不明な場合は仮にpoints[0]とpoints[17]を使用（適宜置き換え）
    const mouthTopY = points[0].y; // 上唇の代表ポイント（例: 0番）
    const mouthBottomY = points[17].y; // 下唇の代表ポイント（例: 17番）
    const mouthVertical = Math.abs(mouthBottomY - mouthTopY); // 口の縦の開き
    const mouthHorizontal = distance(points[61], points[291]); // 口の横幅（口角間の距離）
    const mouthAspectRatio = mouthVertical / mouthHorizontal; // 縦横比（MAR）

    // 4. 閾値の設定（調整可能なパラメータ）
    const EYE_AR_THRESHOLD = 0.4; // 目の縦横比がこの値以下なら目が細まっている
    const CORNER_RISE_THRESHOLD = 0.4; // 口角上がり量がこの値以上なら口角が上がっている（正規化座標想定）
    const MOUTH_AR_THRESHOLD = 0.7; // 口の縦横比がこの値以上なら口が開いている
    console.log("eyeAspectRatio", eyeAspectRatio);
    console.log("cornerRise", cornerRise);
    console.log("mouthAspectRatio", mouthAspectRatio);
    // 5. 条件を全て満たしているか判定
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
      return true; // 笑顔と判定
    } else {
      return false; // 笑顔ではない
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
