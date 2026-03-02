"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { decodeHtml } from "@/lib/utils"

export function VideoInfo({ info }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const formatCount = (count) => {
    if (!count) return "0";
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(count);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-4">
      <h1 className="text-xl sm:text-2xl font-bold leading-tight">{decodeHtml(info?.title)}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 mb-4">
        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarImage src="/placeholder.svg" alt="Channel" />
            <AvatarFallback>{info?.channelTitle?.charAt(0) || 'C'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-foreground leading-tight">{info?.channelTitle}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatCount(info?.subscriberCount || 237000)} subscribers</p>
          </div>
        </div>
        <Button className="w-full sm:w-auto rounded-full font-semibold px-6 bg-blue-600 hover:bg-blue-700 text-white">Subscribe</Button>
      </div>
      <div className="mt-2 bg-secondary/30 p-4 rounded-xl border border-border/10 transition-all duration-300">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-semibold text-sm text-foreground">{formatCount(info?.viewCount)} views</span>
          <span className="text-muted-foreground text-sm font-semibold">•</span>
          <span className="font-semibold text-sm text-foreground">{formatDate(info?.publishedAt)}</span>
          <Badge variant="secondary" className="ml-auto bg-blue-100/50 text-blue-600 hover:bg-blue-200/50 dark:bg-blue-900/30 dark:text-blue-400 border-none transition-colors">#education</Badge>
        </div>
        <p className={`text-sm text-foreground/90 whitespace-pre-wrap ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
          {info?.description}
        </p>
        <Button
          variant="ghost"
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="mt-2 p-0 h-auto font-semibold hover:bg-transparent text-primary"
        >
          {isDescriptionExpanded ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </div>
  )
}

