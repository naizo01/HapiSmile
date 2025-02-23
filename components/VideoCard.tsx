"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"
import Link from "next/link"

interface VideoCardProps {
  id: string
  title: string
  thumbnail: string
}

export function VideoCard({ id, title, thumbnail }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/video/${id}`}>
      <Card
        className="relative overflow-hidden transition-all duration-300 transform hover:scale-105 hover:z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <img src={thumbnail || "/placeholder.svg"} alt={title} className="w-full aspect-video object-cover" />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <Play className="text-white w-12 h-12" />
            </div>
          )}
        </CardContent>
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
            <h3 className="text-white text-sm font-semibold">{title}</h3>
          </div>
        )}
      </Card>
    </Link>
  )
}

