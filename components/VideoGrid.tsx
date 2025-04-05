"use client"

import { useState } from "react"
import { VideoCard } from "@/components/VideoCard"
import { Button } from "@/components/ui/button"

interface Video {
  id: string
  title: string
  thumbnail: string
  category: string
  views: number
  uploadDate: string
}

interface VideoGridProps {
  videos: Video[]
}

export function VideoGrid({ videos }: VideoGridProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedVideos = showAll ? videos : videos.slice(0, 8)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">All Videos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedVideos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
      {!showAll && videos.length > 8 && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setShowAll(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black">
            View All Videos
          </Button>
        </div>
      )}
    </div>
  )
}

