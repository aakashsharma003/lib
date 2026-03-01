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
        <div className="flex items-center rounded-full bg-secondary/40">
          <Button
            variant="ghost"
            onClick={handleLike}
            className="rounded-l-full rounded-r-none px-4 hover:bg-secondary/60 h-9"
          >
            <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium text-sm">{isLiked ? '124K' : '123K'}</span>
          </Button>
          <div className="w-[1px] h-5 bg-border/50" />
          <Button
            variant="ghost"
            onClick={handleDislike}
            className="rounded-r-full rounded-l-none px-4 hover:bg-secondary/60 h-9"
          >
            <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
          </Button>
        </div>

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

