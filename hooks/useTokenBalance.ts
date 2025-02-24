"use client"

import { useState, useEffect } from "react"
import Cookies from 'js-cookie'

const COOKIE_KEY = 'smile_token_balance'

export function useTokenBalance() {
  const [newTokens, setNewTokens] = useState(0)
  const [totalTokens, setTotalTokens] = useState(() => {
    const savedBalance = Cookies.get(COOKIE_KEY)
    return savedBalance ? parseFloat(savedBalance) : 0
  })
  const [lastEarnedToken, setLastEarnedToken] = useState(0)

  useEffect(() => {
    Cookies.set(COOKIE_KEY, totalTokens.toString(), { expires: 365 })
  }, [totalTokens])

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

