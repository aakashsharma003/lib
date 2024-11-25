 import { VideoFeed } from "@/components/video-feed"
import axios from "axios";
import {cache} from "react"


const fetchVideos = cache(async(query) => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const apiURL = process.env.NEXT_PUBLIC_YOUTUBE_API_URL;

  try {
    const response = await axios.get(`${apiURL}/search`, {
      params: {
        part: "snippet",
        key: apiKey,
        type: "video",
        q: query,
        maxResults: 10,
      },
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
})
export default async function HomePage() {
   const videos = await fetchVideos("diya or bati hum");
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
        {/* <h2>hello {videos}</h2> */}
        <VideoFeed videos={videos} />
      </main>
    </div>
  );
}

