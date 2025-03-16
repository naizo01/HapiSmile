'use client';

import "./globals.css"
import type React from "react"
import { Inter } from "next/font/google"
import { SmileProvider } from "@/Context/SmileContext"
import { PrivyProvider } from '@privy-io/react-auth'

// Interフォントの設定を修正
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'] // フォールバックフォントを指定
})

// グローバル型定義を改善
declare global {
  interface Window {
    FilesetResolver: {
      forVisionTasks?: (path: string) => Promise<unknown>
    }
    FaceDetector: {
      createFromOptions?: (vision: unknown, options: Record<string, unknown>) => Promise<unknown>
    }
  }
}

// export const metadata: Metadata = {
//   title: "Smile & Earn Tokens",
//   description: "Earn tokens by smiling while watching videos",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark bg-black">
      <head>
      </head>
      <body className={`${inter.className} bg-black text-foreground min-h-screen`}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            appearance: {
              theme: 'dark',
              accentColor: '#676FFF',
            },
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
          }}
        >
          <SmileProvider>
            {children}
          </SmileProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}

