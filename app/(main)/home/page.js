 import { fetchVideos } from "@/app/utils/youtube";
import { VideoFeed } from "@/components/video-feed";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage({ searchParams }) {
  const { userId } = await auth();

  // Double-check: if not logged in, redirect to landing page
  if (!userId) {
    redirect("/");
  }

  const searchQuery = await searchParams?.search || "Gate Operating System";
  const videos = await fetchVideos(searchQuery);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">
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

