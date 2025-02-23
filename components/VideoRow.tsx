import { VideoCard } from "./VideoCard"

interface Video {
  id: string
  title: string
  thumbnail: string
}

interface VideoRowProps {
  title: string
  videos: Video[]
}

export function VideoRow({ title, videos }: VideoRowProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {videos.map((video) => (
          <div key={video.id} className="flex-none w-64">
            <VideoCard {...video} />
          </div>
        ))}
      </div>
    </div>
  )
}

