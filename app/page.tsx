import { Layout } from "@/components/Layout"
import { VideoSlider } from "@/components/VideoSlider"
import { VideoGrid } from "@/components/VideoGrid"
import videosData from "@/Context/videos.json"
import { Button } from "@/components/ui/button"
import { Play, Info } from "lucide-react"

export default function Home() {
  const shuffleArray = (array: typeof videosData) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const getLatestVideos = () => {
    return shuffleArray(
      videosData.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()),
    ).slice(0, 5)
  }

  const getRankedVideos = () => {
    return shuffleArray(videosData.sort((a, b) => b.views - a.views)).slice(0, 5)
  }

  const getFeaturedVideos = () => {
    return shuffleArray(videosData).slice(0, 5)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="relative h-[60vh] mx-auto my-6 max-w-[1400px] rounded-xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main_header-Yi28YHA7az3zWbCr6D8IdiTOOZlqiW.png')`,
              backgroundSize: "cover",
              filter: "brightness(0.4)",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 lg:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              世界を笑顔に
            </h1>
            <p className="text-base md:text-lg mb-6 text-gray-200 max-w-2xl">
            動画を見て笑顔になるだけでトークンが貯まるプラットフォームです。貯めたトークンは特別なNFTやイベント参加など、さまざまな楽しい体験に交換できます。
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-black text-base md:text-lg px-6 py-5 transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20"
              >
                <Play className="mr-2 h-5 w-5" /> 再生
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base md:text-lg px-6 py-5 border-2 border-yellow-400/50 hover:bg-yellow-500/20 transition-all hover:scale-105 hover:border-yellow-400"
              >
                <Info className="mr-2 h-5 w-5" /> 詳細情報
              </Button>
            </div>
          </div>
        </div>

        {/* Video Sliders */}
        <div className="space-y-12 pb-12 max-w-[1400px] mx-auto overflow-visible">
          <VideoSlider title="最新" videos={getLatestVideos()} />
          <VideoSlider title="ランキング" videos={getRankedVideos()} />
          <VideoSlider title="注目" videos={getFeaturedVideos()} />
        </div>

        {/* All Videos Grid */}
        <div className="pb-12 px-4 max-w-[1400px] mx-auto">
          <VideoGrid videos={shuffleArray(videosData)} />
        </div>
      </div>
    </Layout>
  )
}

