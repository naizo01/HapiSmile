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
    title: "Unlock Limited Video",
    description: "Access exclusive content",
    cost: 10,
    imageSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unlock_limited_video_nft-eEKfVGpCweEdPKiLu68SJ5hQJ4RB1L.png",
  },
  {
    id: "nft-exchange",
    title: "NFT Exchange",
    description: "Get unique digital collectibles",
    cost: 50,
    imageSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NFT_Exchange_nft-jOg0oOgwvK7LagFccCEdp2oFrZTFq7.png",
  },
  {
    id: "offline-event",
    title: "Offline Event QR Code",
    description: "Get access to exclusive offline events",
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
    // Load claimed rewards from local storage
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

      // Use custom toast for success message
      toast(<CustomToast message={`Acquired: ${reward.title}`} />, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      // Update claimed rewards
      const newClaimedRewards = { ...claimedRewards, [reward.id]: true }
      setClaimedRewards(newClaimedRewards)
      localStorage.setItem("claimedRewards", JSON.stringify(newClaimedRewards))
    } else {
      toast.error("You don't have enough tokens to claim this reward")
    }
    setIsProcessing(false)
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Rewards</h1>
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

