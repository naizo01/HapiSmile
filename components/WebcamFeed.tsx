"use client"

import { useRef, useEffect, useState } from "react"
import { CardContent } from "@/components/ui/card"
import { useSmile } from "@/Context/SmileContext"

export function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)
  const { setIsSmiling } = useSmile()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getContext = (): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current
    return canvas ? canvas.getContext('2d') : null
  }

  // 笑顔を検出する関数
  const detectSmile = (points: any) => {
    // 口の上下の点（上唇の上端と下唇の下端）
    const upperLip = points[13]
    const lowerLip = points[14]
    
    // 口の左右の点
    const leftMouth = points[78]
    const rightMouth = points[308]

    // 口の縦と横の比率を計算
    const mouthHeight = Math.abs(upperLip.y - lowerLip.y)
    const mouthWidth = Math.abs(leftMouth.x - rightMouth.x)
    const mouthRatio = mouthWidth / mouthHeight
    // 比率が一定以上なら笑顔と判定
    return mouthRatio < 10.0
  }

  useEffect(() => {
    if (!isClient) return

    const setupFaceMesh = async () => {
      try {
        const { FaceMesh, FACEMESH_TESSELATION } = await import('@mediapipe/face_mesh')
        const { Camera } = await import('@mediapipe/camera_utils')
        const { drawConnectors } = await import('@mediapipe/drawing_utils')

        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
          }
        })

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        faceMesh.onResults((results) => {
          const points = results.multiFaceLandmarks[0]
          const videoElement = videoRef.current
          const canvasElement = canvasRef.current

          if (!canvasElement || !videoElement || !points) return
          
          canvasElement.width = videoElement.videoWidth
          canvasElement.height = videoElement.videoHeight
          
          const canvasCtx = getContext()
          if (!canvasCtx) return

          canvasCtx.save()
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

          // 笑顔検出
          const smiling = detectSmile(points)
          setIsSmiling(smiling)

          // メッシュの描画
          drawConnectors(canvasCtx, points, FACEMESH_TESSELATION, {
            color: smiling ? "#00FF0070" : "#C0C0C070", // 笑顔のときは緑色に
            lineWidth: 1,
          })

          // 笑顔検出時のテキスト表示
          if (smiling) {
            canvasCtx.font = '30px Arial'
            canvasCtx.fillStyle = '#00FF00'
            canvasCtx.fillText('😊 Smiling!', 20, 40)
          }

          canvasCtx.restore()
        })

        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current) {
                await faceMesh.send({ image: videoRef.current })
              }
            },
            width: 1280,
            height: 720
          })
          camera.start()
        }
      } catch (error) {
        console.error('Error setting up FaceMesh:', error)
      }
    }

    setupFaceMesh()
  }, [isClient])

  if (!isClient) return null

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
  )
}