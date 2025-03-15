"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { RewardCard } from "@/components/RewardCard"
import { useTokenBalance } from "@/hooks/useTokenBalance"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import { NFTClaimModal } from "@/components/NFTClaimModal"
import { toast, ToastContainer } from "react-toastify"
import { CustomToast } from "@/components/CustomToast"
import "react-toastify/dist/ReactToastify.css"

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  imageSrc: string
}

const REWARDS: Reward[] = [
  {
    id: "limited-video",
    title: "限定動画を解除",
    description: "独占コンテンツにアクセス",
    cost: 10,
    imageSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unlock_limited_video_nft-eEKfVGpCweEdPKiLu68SJ5hQJ4RB1L.png",
  },
  {
    id: "nft-exchange",
    title: "NFT交換",
    description: "ユニークなデジタルコレクティブルを入手",
    cost: 50,
    imageSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NFT_Exchange_nft-jOg0oOgwvK7LagFccCEdp2oFrZTFq7.png",
  },
  {
    id: "offline-event",
    title: "オフラインイベントQRコード",
    description: "限定オフラインイベントへのアクセス権を取得",
    cost: 100,
    imageSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Offline_Event_QR_Code_nft-lIvemVg5VSn47IaLhMT7eFIB0v7s1r.png",
  },
]

export default function RewardsPage() {
  const { totalTokens, earnTokens } = useTokenBalance()
  const [isProcessing, setIsProcessing] = useState(false)
  const [claimedNFT, setClaimedNFT] = useState<{ name: string; image: string; tokenId: string } | null>(null)
  const [claimedRewards, setClaimedRewards] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // ローカルストレージから獲得済み報酬を読み込む
    const savedClaimedRewards = localStorage.getItem("claimedRewards")
    if (savedClaimedRewards) {
      setClaimedRewards(JSON.parse(savedClaimedRewards))
    }
  }, [])

  const handleRewardClaim = (reward: Reward) => {
    setIsProcessing(true)
    if (totalTokens >= reward.cost) {
      earnTokens(-reward.cost)
      const tokenId = `NFT-${Date.now()}`
      setClaimedNFT({ name: reward.title, image: reward.imageSrc, tokenId })

      // 成功メッセージにカスタムトーストを使用
      toast(<CustomToast message={`獲得しました: ${reward.title}`} />, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      // 獲得済み報酬を更新
      const newClaimedRewards = { ...claimedRewards, [reward.id]: true }
      setClaimedRewards(newClaimedRewards)
      localStorage.setItem("claimedRewards", JSON.stringify(newClaimedRewards))
    } else {
      toast.error("この報酬を獲得するのに十分なトークンがありません")
    }
    setIsProcessing(false)
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">報酬</h1>
        <div className="mb-8">
          <BalanceDisplay balance={totalTokens} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REWARDS.map((reward) => (
            <RewardCard
              key={reward.id}
              imageSrc={reward.imageSrc}
              title={reward.title}
              description={reward.description}
              cost={reward.cost}
              onClaim={() => handleRewardClaim(reward)}
              isDisabled={isProcessing || totalTokens < reward.cost || claimedRewards[reward.id]}
              isClaimed={claimedRewards[reward.id]}
            />
          ))}
        </div>
        <ToastContainer position="bottom-right" theme="dark" />
        <NFTClaimModal
          isOpen={!!claimedNFT}
          onClose={() => setClaimedNFT(null)}
          nftDetails={claimedNFT || { name: "", image: "", tokenId: "" }}
        />
      </div>
    </Layout>
  )
}

