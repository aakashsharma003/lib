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
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <Button 
        variant={isLiked ? "default" : "outline"} 
        size="sm" 
        onClick={handleLike}
        className="flex-grow sm:flex-grow-0"
      >
        <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        {isLiked ? '124K' : '123K'}
      </Button>
      <Button 
        variant={isDisliked ? "default" : "outline"} 
        size="sm" 
        onClick={handleDislike}
        className="flex-grow sm:flex-grow-0"
      >
        <ThumbsDown className={`mr-2 h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
        Dislike
      </Button>
      <Button variant="outline" size="sm" className="flex-grow sm:flex-grow-0">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button variant="outline" size="sm" className="flex-grow sm:flex-grow-0">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button 
        variant={isSaved ? "default" : "outline"} 
        size="sm" 
        onClick={() => setIsSaved(!isSaved)}
        className="flex-grow sm:flex-grow-0"
      >
        {isSaved ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
        {isSaved ? 'Saved' : 'Save'}
      </Button>
    </div>
  )
}

