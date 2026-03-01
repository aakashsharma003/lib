'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, BookOpen, Book } from 'lucide-react'
import { RecommendedVideos } from "@/components/recomend-video"
import { VideoInfo } from "@/components/video-info"
import { UserActions } from "@/components/user-actions"
import { VideoPlayer } from "@/components/video-player"
import { CreatePost } from "@/components/create-post"
import { VideoChat } from "@/components/video-chat"
import { VideoNotes } from "@/components/video-notes"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getInfoWithVideoId, getRelatedVideos } from "@/app/utils/youtube"


export default function Page() {
  const [info, setInfo] = useState();
  const [videos, setVideo] = useState();
  const [channelid, setchannelId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const { videoId } = useParams();

  useEffect(() => {
    if (!videoId) return;

    const getRecommendedVideo = async (q) => {
      const resp = await getRelatedVideos(q);
      // Todo : fix it with channelId
      setVideo(resp);
    };

    const getVideoInfo = async () => {
      const videoInfo = await getInfoWithVideoId(videoId);
      setInfo(videoInfo);

      if (videoInfo) {
        await getRecommendedVideo(
          `${videoInfo.title} ${videoInfo.channelTitle}`,
        );
      }
    };

    getVideoInfo();
  }, [videoId]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer videoId={videoId} />

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 pt-2 border-b border-border/10 pb-4">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('overview')}
                  className="rounded-full px-5 hover:bg-secondary/60 border-border/50"
                >
                  Overview
                </Button>
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('chat')}
                  className="rounded-full px-5 hover:bg-secondary/60 border-border/50"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask Questions
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-5 hover:bg-secondary/60 border-border/50"
                  onClick={() => {
                    import("sonner").then(({ toast }) => {
                      toast.info("Feature under construction!", {
                        description: "Quick Revise is currently being built and will be available soon."
                      });
                    });
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Quick Revise
                </Button>
                <Button
                  variant={activeTab === 'notes' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('notes')}
                  className="rounded-full px-5 hover:bg-secondary/60 border-border/50"
                >
                  <Book className="mr-2 h-4 w-4" />
                  Notes
                </Button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <VideoInfo info={info} />
                  <UserActions />
                </div>
              )}
              {activeTab === 'chat' && <VideoChat videoId={videoId} />}
              {activeTab === 'notes' && <VideoNotes videoId={videoId} channelTitle={info?.channelTitle} />}

            </div>
            <div>
              <RecommendedVideos videos={videos} />
            </div>
          </div>
        </div>
      </main>
      <CreatePost videoId={videoId} />
    </div>
  );
}


