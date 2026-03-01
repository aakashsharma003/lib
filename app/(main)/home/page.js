import { fetchVideos } from "@/app/utils/youtube";
import { VideoFeed } from "@/components/video-feed";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoSkeleton } from "@/components/video-skelaton";

export default async function HomePage({ searchParams }) {
  const { userId } = await auth();

  // Double-check: if not logged in, redirect to landing page
  if (!userId) {
    redirect("/");
  }

  const params = await searchParams;
  const searchQuery = params?.search || ""; // Empty string relies on API fallback
  const result = await fetchVideos(searchQuery);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
        <Suspense fallback={<VideoSkeleton count={12} />}>
          <VideoFeed initialVideos={result.items} initialPageToken={result.nextPageToken} searchQuery={searchQuery} initialBlocked={result.blockedByAI} />
        </Suspense>

      </main>
    </div>
  );
}

