"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    vision: any
  }
}

export function FaceLandmarker() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [faceLandmarker, setFaceLandmarker] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.vision) {
      initializeFaceLandmarker()
    }
  }, [])

  const initializeFaceLandmarker = async () => {
    const vision = await window.vision.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    )
    const faceLandmarker = await window.vision.FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
      numFaces: 1,
    })
    setFaceLandmarker(faceLandmarker)
  }

  useEffect(() => {
    if (faceLandmarker && videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            video.srcObject = stream
            video.play()
          })
          .catch((err) => {
            console.error("Error accessing the webcam", err)
          })
      }

      let animationFrameId: number

      const detectFace = () => {
        if (video.readyState === 4) {
          const detections = faceLandmarker.detectForVideo(video, performance.now())

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            if (detections.faceLandmarks) {
              for (const landmarks of detections.faceLandmarks) {
                drawConnectors(ctx, landmarks, window.vision.FACEMESH_TESSELATION, { color: "#C0C0C070", lineWidth: 1 })
                drawConnectors(ctx, landmarks, window.vision.FACEMESH_RIGHT_EYE, { color: "#FF3030" })
                drawConnectors(ctx, landmarks, window.vision.FACEMESH_RIGHT_EYEBROW, { color: "#FF3030" })
                drawConnectors(ctx, landmarks, window.vision.FACEMESH_LEFT_EYE, { color: "#30FF30" })
                drawConnectors(ctx, landmarks, window.vision.FACEMESH_LEFT_EYEBROW, { color: "#30FF30" })
                drawConnectors(ctx, landmarks, window.vision.FACEMESH_FACE_OVAL, { color: "#E0E0E0" })
                drawConnectors(ctx, landmarks, window.vision.FACEMESH_LIPS, { color: "#E0E0E0" })
              }
            }
          }
        }
        animationFrameId = requestAnimationFrame(detectFace)
      }

      video.addEventListener("loadeddata", detectFace)

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        if (video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    }
  }, [faceLandmarker])

  return (
    <div className="relative">
      <video ref={videoRef} className="hidden" width="640" height="480" />
      <canvas ref={canvasRef} className="w-full h-auto" width="640" height="480" />
    </div>
  )
}

function drawConnectors(
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  connections: number[][],
  style: { color: string; lineWidth?: number },
) {
  if (!ctx) return

  ctx.strokeStyle = style.color
  ctx.lineWidth = style.lineWidth || 1

  for (const connection of connections) {
    const [start, end] = connection
    if (landmarks[start] && landmarks[end]) {
      ctx.beginPath()
      ctx.moveTo(landmarks[start].x * ctx.canvas.width, landmarks[start].y * ctx.canvas.height)
      ctx.lineTo(landmarks[end].x * ctx.canvas.width, landmarks[end].y * ctx.canvas.height)
      ctx.stroke()
    }
  }
}

