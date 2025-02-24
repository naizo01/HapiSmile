import "./globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SmileProvider } from "@/Context/SmileContext"

// Interフォントの設定を修正
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'] // フォールバックフォントを指定
})

// グローバル型定義
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
      </head>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <SmileProvider>
          {children}
        </SmileProvider>
      </body>
    </html>
  )
}

