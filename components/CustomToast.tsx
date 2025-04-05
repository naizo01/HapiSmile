"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Check, Star } from "lucide-react"

interface CustomToastProps {
  message: string
}

export const CustomToast: React.FC<CustomToastProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4"
    >
      <div className="flex-shrink-0">
        <div className="bg-white bg-opacity-20 rounded-full p-2">
          <Check className="h-6 w-6" />
        </div>
      </div>
      <div className="flex-1">
        <p className="font-semibold">Successfully Acquired!</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <Star className="h-6 w-6 text-yellow-300" />
      </motion.div>
    </motion.div>
  )
}

