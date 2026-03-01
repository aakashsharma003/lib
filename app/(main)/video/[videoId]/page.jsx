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
import { useParams, useRouter } from "next/navigation"
import { getInfoWithVideoId, getRelatedVideos } from "@/app/utils/youtube"
import { verifySecureVideoLink } from "@/app/actions/video"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"


export default function Page() {
  const [info, setInfo] = useState();
  const [videos, setVideo] = useState();
  const [activeTab, setActiveTab] = useState("overview");
  const { videoId: rawVideoId } = useParams();
  const router = useRouter();
  const [realVideoId, setRealVideoId] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    if (!rawVideoId) return;

    const verifyAndLoad = async () => {
      try {
        // 1. Decrypt and verify DB entry
        const decryptedId = await verifySecureVideoLink(rawVideoId);
        if (!decryptedId) {
          setIsInvalid(true);
          return;
        }
        setRealVideoId(decryptedId);

        // 2. Fetch YouTube Info
        const videoInfo = await getInfoWithVideoId(decryptedId);

        // Security: Block any content that does not belong to Education category (27)
        if (videoInfo && videoInfo.categoryId !== '27' && videoInfo.categoryId !== 27) {
          setIsRestricted(true);
          toast.error("Non-educational content restricted.");
          router.push('/home');
          return;
        }

        setInfo(videoInfo);

        if (videoInfo) {
          const resp = await getRelatedVideos(`${videoInfo.title} ${videoInfo.channelTitle}`);
          setVideo(resp);
        }
      } catch (e) {
        setIsInvalid(true);
      }
    };

    verifyAndLoad();
  }, [rawVideoId]);

  if (isInvalid) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-12 text-center w-full max-w-4xl mx-auto rounded-2xl">
        <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/50 bg-destructive/10 dark:bg-destructive/5 rounded-2xl w-full">
          <div className="w-16 h-16 bg-destructive/20 dark:bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight text-destructive">Access Denied</h2>
          <p className="text-foreground/80 text-lg max-w-lg mb-6">
            This is not a hacking competition 😅! Please don’t inject random video IDs.
          </p>
          <p className="text-destructive font-semibold max-w-xl p-4 bg-destructive/10 rounded-md text-lg">
            ⚠️ Heads up: Repeated attempts to manipulate content (2+ times)
            will automatically restrict your profile access.
            Help us keep this platform focused and clean.
          </p>
          <Link href="/home" className="mt-8">
            <Button variant="default" size="lg" className="rounded-full px-8">Return to Library</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isRestricted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Redirecting to Library...</p>
      </div>
    );
  }

  if (!realVideoId || !info) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer videoId={realVideoId} />

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
                  className="tour-ask-ai rounded-full px-5 hover:bg-secondary/60 border-border/50"
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
                  className="tour-library-management rounded-full px-5 hover:bg-secondary/60 border-border/50"
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
              {activeTab === 'chat' && <VideoChat videoId={realVideoId} />}
              {activeTab === 'notes' && <VideoNotes videoId={realVideoId} channelTitle={info?.channelTitle} />}

            </div>
            <div>
              <RecommendedVideos videos={videos} />
            </div>
          </div>
        </div>
      </main>
      <CreatePost videoId={realVideoId} />
    </div>
  );
}


