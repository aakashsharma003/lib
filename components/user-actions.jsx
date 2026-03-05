"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Share2, Download, Plus, Check } from 'lucide-react'

export function UserActions() {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 mt-4 pb-4">
        <Button
          variant="ghost"
          onClick={handleLike}
          className={`rounded-full bg-secondary/40 hover:bg-secondary/60 px-4 h-9 ${isLiked ? 'text-primary' : ''}`}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          <span className="font-medium text-sm">{isLiked ? '124K' : '123K'}</span>
        </Button>
        <Button
          variant="ghost"
          onClick={handleDislike}
          className={`rounded-full bg-secondary/40 hover:bg-secondary/60 px-4 h-9 ${isDisliked ? 'text-destructive' : ''}`}
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
        </Button>

        <Button variant="ghost" className="rounded-full bg-secondary/40 hover:bg-secondary/60 px-4 h-9">
          <Share2 className="mr-2 h-4 w-4" />
          <span className="font-medium text-sm">Share</span>
        </Button>
        <Button variant="ghost" className="rounded-full bg-secondary/40 hover:bg-secondary/60 px-4 h-9">
          <Download className="mr-2 h-4 w-4" />
          <span className="font-medium text-sm">Download</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsSaved(!isSaved)}
          className="rounded-full bg-secondary/40 hover:bg-secondary/60 px-4 h-9"
        >
          {isSaved ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          <span className="font-medium text-sm">{isSaved ? 'Saved' : 'Save'}</span>
        </Button>
      </div>
    </div>
  )
}

