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
import { getInfoWithVideoId, getRelatedVideos } from "@/app/utils/youtube"


export default function Page() {
  const [info, setInfo] = useState(); 
  const [videos, setVideo] = useState(); 
  const [channelid, setchannelId] = useState("");
  const {videoId} = useParams();
  
  useEffect(() => {
     const getVideoInfo = async() => {
      const videoInfo = await getInfoWithVideoId(videoId);
       
      // console.log("yha tk aya");
       setInfo(videoInfo);

      //  setchannelId(videoInfo.title + " " + videoInfo.channelTitle)
       if (videoInfo) {
        // Call getRecommendedVideo after setting the channelId
        await getRecommendedVideo(videoInfo.title + " " + videoInfo.channelTitle);
      } else {
        // console.log("Failed to fetch video details.");
      }
     }

     const getRecommendedVideo = async(q) => {
       const resp = await getRelatedVideos(q);
       // Todo : fix it with channelId

      // console.log("yha tk channel aya",resp);
       setVideo(resp);
      if (videos) {
        // console.log("Video Info:", videos);
      } else {
        console.log("Failed to fetch related videos.");
      }
     }
     
     getVideoInfo();
    //  getRecommendedVideo();
  }, [])
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer videoId={videoId} />
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
              <VideoInfo info={info}/>
              <UserActions />
            </div>
            <div>
              <RecommendedVideos videos={videos}/>
            </div>
          </div>
        </div>
      </main>
      <CreatePost videoId={videoId} />
    </div>
  );
}


