"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send } from "lucide-react"
import commentsData from "../Context/comments.json"

interface Comment {
  id: number
  user: string
  avatar: string
  content: string
  timestamp: string
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(commentsData)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async () => {
    if (newComment.trim() === "") return

    setIsSubmitting(true)

    // ネットワーク遅延をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newCommentObj: Comment = {
      id: comments.length + 1,
      user: "CurrentUser", // 実際のユーザー名に置き換えることができます
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=CurrentUser${Date.now()}`,
      content: newComment,
      timestamp: new Date().toISOString(),
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")
    setIsSubmitting(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  return (
    <div className="space-y-6">
      {/* コメント入力セクション */}
      <div className="relative space-y-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/6.x/avataaars/svg?seed=CurrentUser`} alt="現在のユーザー" />
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="relative">
              <Textarea
                placeholder="あなたの考えを共有しましょう..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[100px] bg-gray-950/50 border-gray-800 focus:border-yellow-500/50 transition-colors resize-none pr-12"
              />
              <div className="absolute right-3 bottom-3">
                <Button
                  size="icon"
                  onClick={handleAddComment}
                  disabled={isSubmitting || newComment.trim() === ""}
                  className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black h-8 w-8"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-400">Shift + Enterで改行、Enterで送信</p>
          </div>
        </div>
      </div>

      {/* コメント数 */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <MessageCircle className="h-5 w-5" />
        <span>{comments.length} コメント</span>
      </div>

      {/* コメントリスト */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <div key={comment.id} className="group">
              {index > 0 && <Separator className="my-6 bg-gray-800" />}
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.avatar} alt={comment.user} />
                  <AvatarFallback>{comment.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-200">{comment.user}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

