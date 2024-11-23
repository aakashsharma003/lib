'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, BookOpen, Book } from 'lucide-react'
import { RecommendedVideos } from "@/components/recomend-video"
import { VideoInfo } from "@/components/video-info"
import { UserActions } from "@/components/user-actions"
import { Header } from "@/components/header"
import { VideoPlayer } from "@/components/video-player"
import { CreatePost } from "@/components/create-post"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function Page() {
  const {videoId} = useParams();
  const [video, setVideo] = useState(null);
  useEffect(() => {
      if (videoId) {
        const fetchVideoDetails = async () => {
          try {
            const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; 
            const apiURL = `${process.env.NEXT_PUBLIC_YOUTUBE_API_URL}/videos`;
            const response = await axios.get(apiURL, {
              params: {
                part: 'snippet,contentDetails,statistics',
                id: videoId,
                key: apiKey
              }
            });
  
            if (response.status === 200 && response.data.items.length > 0) {
              setVideo(response.data.items[0]);  // Store the video data in state
            } else {
              // setError('Video not found');
            }
          } catch (err) {
            console.error('Error fetching video details:', err);
            // setError('Failed to fetch video details');
          } finally {
            // setLoading(false);
          }
        };
  
        fetchVideoDetails();
      }
    }, [videoId]); 


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer videoId={videoId}/>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/video-summary">
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


