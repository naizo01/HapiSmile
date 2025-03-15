"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NFTClaimModalProps {
  isOpen: boolean
  onClose: () => void
  nftDetails: {
    name: string
    image: string
    tokenId: string
  }
}

export function NFTClaimModal({ isOpen, onClose, nftDetails }: NFTClaimModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-yellow-400">NFT獲得！</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6 text-gray-400" />
              </Button>
            </div>
            <div className="text-center">
              <img
                src={nftDetails.image || "/placeholder.svg"}
                alt={nftDetails.name}
                className="w-64 h-64 object-cover mx-auto mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2 text-white">{nftDetails.name}</h3>
              <p className="text-gray-400 mb-4">トークンID: {nftDetails.tokenId}</p>
              <div className="space-y-2">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">ギャラリーで見る</Button>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  閉じる
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

