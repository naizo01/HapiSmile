import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { VideoCard } from "@/components/VideoCard"

interface Video {
  id: string
  title: string
  thumbnail: string
  category: string
  views: number
  uploadDate: string
}

interface VideoSliderProps {
  title: string
  videos: Video[]
}

export function VideoSlider({ title, videos }: VideoSliderProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white px-12">{title}</h2>
      <div className="relative px-12 group">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {videos.map((video) => (
              <CarouselItem key={video.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <VideoCard {...video} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="absolute -right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Carousel>
      </div>
    </div>
  )
}

