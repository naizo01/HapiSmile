"use client"

import { useState, useEffect } from "react"
import { YouTubePlayer } from "@/components/YouTubePlayer"
import { TokenDisplay } from "@/components/TokenDisplay"
import { CommentSection } from "@/components/CommentSection"
import { WebcamFeed } from "@/components/WebcamFeed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import videosData from "@/context/videos.json"
import { Layout } from "@/components/Layout"
import { useParams } from "next/navigation"
import { useTokenBalance } from "@/hooks/useTokenBalance"
import { motion, AnimatePresence } from "framer-motion"
import { useSmile } from "@/Context/SmileContext"

interface Video {
  id: string
  title: string
  thumbnail: string
}

export default function VideoPage() {
  const params = useParams()
  const { isSmiling } = useSmile()
  const [smileScore, setSmileScore] = useState(0)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [showEffect, setShowEffect] = useState(false)
  const { newTokens, totalTokens, lastEarnedToken, earnTokens } = useTokenBalance()

  useEffect(() => {
    const videoId = params?.id as string
    const video = videosData.find((v) => v.id === videoId)
    setCurrentVideo(video || videosData[0] || null)
  }, [params?.id])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isSmiling && !showEffect) {
      const earned = Math.random() * 2 + 1
      earnTokens(earned)
      setShowEffect(true)
    }

    if (showEffect) {
      timer = setTimeout(() => {
        setShowEffect(false)
      }, 2000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isSmiling, showEffect, earnTokens])

  const createConfetti = () => {
    return Array.from({ length: 50 }).map((_, index) => (
      <motion.div
        key={index}
        className="confetti"
        initial={{
          top: "-10px",
          left: `${Math.random() * 100}%`,
          opacity: 1,
          scale: 0,
        }}
        animate={{
          top: "100vh",
          rotate: Math.random() * 720 - 360,
          opacity: 0,
          scale: 1,
        }}
        transition={{
          duration: 5,
          delay: Math.random() * 0.5,  // 遅延を短くする（0〜0.5秒）
          ease: "easeOut",
        }}
      />
    ))
  }

  return (
    <Layout>
      <div className="relative min-h-screen pt-16">
        <AnimatePresence>
          {showEffect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 pointer-events-none bg-cover bg-center"
              style={{
                backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main_header-Yi28YHA7az3zWbCr6D8IdiTOOZlqiW.png')`,
                zIndex: 0,
              }}
            />
          )}
        </AnimatePresence>
        <div className="relative z-10">
          {currentVideo ? (
            <div className="container mx-auto p-2">
              <div className="grid grid-cols-12 gap-2">
                {/* メインコンテンツエリア（動画） */}
                <div className="col-span-9">
                  <Card className="overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-500/50 shadow-xl">
                    <CardContent className="p-0 aspect-video">
                      <YouTubePlayer videoId={currentVideo.id} />
                    </CardContent>
                  </Card>
                </div>

                {/* サイドバー（WebcamとTokens） */}
                <div className="col-span-3 flex flex-col gap-2 max-w-[320px]">
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm">
                    <CardHeader className="p-2">
                      <CardTitle className="text-sm font-bold text-white">Your Smile</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 aspect-video">
                      <WebcamFeed />
                    </CardContent>
                  </Card>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TokenDisplay newTokens={newTokens} totalTokens={totalTokens} smileScore={smileScore} />
                  </motion.div>
                </div>
              </div>

              {/* コメントセクション */}
              <div className="mt-4">
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="p-2">
                    <CardTitle className="text-sm font-bold text-white">Comments</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <CommentSection />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[50vh]">
              <p className="text-xl text-primary animate-pulse">Loading video...</p>
            </div>
          )}
        </div>
        {/* コンフェティ */}
        <AnimatePresence>
          {showEffect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 20 }}
            >
              {createConfetti()}
            </motion.div>
          )}
        </AnimatePresence>
        {/* 右下の通知 */}
        <AnimatePresence>
          {lastEarnedToken > 0 && showEffect && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "100%" }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: "100%" }}
              transition={{ type: "spring", stiffness: 100 }}
              className="fixed bottom-4 right-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded-full shadow-lg"
              style={{ zIndex: 30 }}
            >
              +{lastEarnedToken.toFixed(1)} LOL Earned!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

