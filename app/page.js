 import { VideoFeed } from "@/components/video-feed"
import { fetchVideos } from "./utils/youtube";
import { Suspense } from "react";
export default async function HomePage({ searchParams }) {
  const searchQuery = searchParams?.search || "operating system";
  const videos = await fetchVideos(searchQuery);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
        {/* <h2>hello {videos}</h2> */}
        <Suspense fallback={<div>loading...</div>
        }>
         <VideoFeed initialVideos={videos} searchQuery={searchQuery} />
        </Suspense>

      </main>
    </div>
  );
}

