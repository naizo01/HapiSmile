"use client"

import { useState, useEffect } from "react"

export function useTokenBalance() {
  const [newTokens, setNewTokens] = useState(0)
  const [totalTokens, setTotalTokens] = useState(100)
  const [lastEarnedToken, setLastEarnedToken] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const earned = Math.random() * 2
      setNewTokens((prev) => prev + earned)
      setTotalTokens((prev) => prev + earned)
      setLastEarnedToken(earned)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return {
    newTokens,
    totalTokens,
    lastEarnedToken,
    earnTokens: (amount: number) => {
      setNewTokens((prev) => prev + amount)
      setTotalTokens((prev) => prev + amount)
      setLastEarnedToken(amount)
    },
  }
}

