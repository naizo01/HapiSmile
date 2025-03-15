"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface RewardCardProps {
  imageSrc: string
  title: string
  description: string
  cost: number
  onClaim: () => void
  isDisabled: boolean
  isClaimed: boolean
}

export function RewardCard({ imageSrc, title, description, cost, onClaim, isDisabled, isClaimed }: RewardCardProps) {
  return (
    <Card className="bg-card border-primary/50 hover:border-primary transition-colors overflow-hidden">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <motion.img
            src={imageSrc}
            alt={title}
            className="w-48 h-48 object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary">{cost} LOL</p>
      </CardContent>
      <CardFooter>
        <motion.div
          className="w-full"
          whileHover={{ scale: isClaimed ? 1 : 1.02 }}
          whileTap={{ scale: isClaimed ? 1 : 0.98 }}
        >
          {isClaimed ? (
            <Button
              disabled
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg cursor-default"
            >
              <Check className="mr-2 h-5 w-5" /> 獲得済み
            </Button>
          ) : (
            <Button
              onClick={onClaim}
              disabled={isDisabled}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              報酬を獲得
            </Button>
          )}
        </motion.div>
      </CardFooter>
    </Card>
  )
}

