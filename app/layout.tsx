import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

declare global {
  interface Window {
    FilesetResolver: any
    FaceDetector: any
  }
}

export const metadata: Metadata = {
  title: "Smile & Earn Tokens",
  description: "Earn tokens by smiling while watching videos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>{children}</body>
    </html>
  )
}

