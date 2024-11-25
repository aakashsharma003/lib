'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, BookOpen, Book } from 'lucide-react'
import { RecommendedVideos } from "@/components/recomend-video"
import { VideoInfo } from "@/components/video-info"
import { UserActions } from "@/components/user-actions"
import { VideoPlayer } from "@/components/video-player"
import { CreatePost } from "@/components/create-post"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"


export default function Page() {
  const {videoId} = useParams();  
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer videoId={videoId}/>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`${videoId}/ask`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask Questions
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/quick-revise">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Quick Revise
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/quick-revision-materials">
                    <Book className="mr-2 h-4 w-4" />
                    Revision Materials
                  </Link>
                </Button>
              </div>
              <VideoInfo />
              <UserActions />
            </div>
            <div>
              <RecommendedVideos />
            </div>
          </div>
        </div>
      </main>
      <CreatePost />
    </div>
  )
}


