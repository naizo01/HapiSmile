"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Coins } from "lucide-react"

interface BalanceDisplayProps {
  balance: number
}

export function BalanceDisplay({ balance }: BalanceDisplayProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* グラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20" />

      {/* アニメーション付きボーダーグラデーション */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"
        style={{
          filter: "blur(4px)",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* コンテンツコンテナ */}
      <motion.div
        className="relative p-8 bg-black/50 backdrop-blur-sm"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-200/80">あなたの残高</h3>
            <motion.p
              className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
              animate={{
                scale: isHovered ? 1.02 : 1,
                filter: isHovered ? "brightness(1.2)" : "brightness(1)",
              }}
              transition={{ duration: 0.3 }}
            >
              {balance.toFixed(1)} LOL
            </motion.p>
          </div>
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-50" />
            <div className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-4 rounded-full">
              <Coins className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>

        {/* 光沢効果 */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
          style={{
            transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
            transition: "transform 0.6s ease-in-out",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

