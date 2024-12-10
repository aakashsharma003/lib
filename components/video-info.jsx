"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function VideoInfo({info}) {
  console.log("informatopn",info)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  return (
    <div className="mt-4">
      <h1 className="text-xl sm:text-2xl font-bold">{info?.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src="/placeholder.svg" alt="Channel" />
            <AvatarFallback>BF</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{info?.channelTitle}</p>
            <p className="text-sm text-gray-500">{info?.likeCount}</p>
          </div>
        </div>
        <Button className="w-full sm:w-auto">Subscribe</Button>
      </div>
      <div className="mt-4 bg-secondary p-4 rounded-lg">
        <div className="flex flex-wrap items-center justify-between mb-2">
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
            <Badge variant="secondary">{info?.channelTitle} views</Badge>
            <Badge variant="secondary">{info?.publishedAt}</Badge>
          </div>
          <Badge variant="outline">#education</Badge>
        </div>
        <p className={`text-sm ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
        {info?.description}
        </p>
        <Button 
          variant="link" 
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="mt-2 p-0 h-auto font-normal"
        >
          {isDescriptionExpanded ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </div>
  )
}

