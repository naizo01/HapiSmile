import YouTube from "react-youtube"
import { CardContent } from "@/components/ui/card"

interface YouTubePlayerProps {
  videoId: string
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  return (
    <CardContent className="p-0">
      <div className="aspect-video w-full">
        <YouTube
          videoId={videoId}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
            },
          }}
          className="w-full h-full"
          iframeClassName="w-full h-full"
        />
      </div>
    </CardContent>
  )
}

