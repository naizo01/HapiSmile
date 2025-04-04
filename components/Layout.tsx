"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePrivy } from '@privy-io/react-auth'
import Image from 'next/image'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { ready, authenticated, login } = usePrivy();
  
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800">
        <div className="relative">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main_header-Yi28YHA7az3zWbCr6D8IdiTOOZlqiW.png')`,
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Header Content */}
          <div className="container mx-auto flex justify-between items-center px-4 py-3 relative z-10 max-w-[1400px]">
            <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hapisimile_icon-RpUMtfmOWEqaWshMAf38NAOhHhk0L7.jpeg"
                alt="HappySmile Logo"
                className="rounded-xl shadow-lg"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                HappySmile
              </span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-8">
              <Link href="/" passHref>
                <Button
                  variant="ghost"
                  className="relative text-white hover:text-yellow-300 text-sm sm:text-base font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  Video Library
                </Button>
              </Link>
              <Link href="/video/1" passHref>
                <Button
                  variant="ghost"
                  className="relative text-white hover:text-yellow-300 text-sm sm:text-base font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  Watch Video
                </Button>
              </Link>
              <Link href="/rewards" passHref>
                <Button
                  variant="ghost"
                  className="relative text-white hover:text-yellow-300 text-sm sm:text-base font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  Rewards
                </Button>
              </Link>
              
              {/* Login Button */}
              <Button
                variant="outline"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-medium px-4 py-2 rounded-lg transition-all"
                disabled={!ready || authenticated}
                onClick={() => login()}
              >
                {authenticated ? "Logged In" : "Login"}
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="pt-16">{children}</main>
    </div>
  )
}

