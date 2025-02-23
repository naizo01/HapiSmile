"use client"

import { useRef, useEffect } from "react"
import { CardContent } from "@/components/ui/card"

export function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Error accessing the webcam", err)
        })
    }
  }, [])

  return (
    <CardContent className="p-0">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
    </CardContent>
  )
}

