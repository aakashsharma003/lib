'use client'
import { Header } from "@/components/header"
import { VideoFeed } from "@/components/video-feed"
import { useState } from "react"

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const updateData = (newData) => {
    console.log("Data received in parent:", newData); 
    setVideos(newData)
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header updateData={updateData}/>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
        {/* <h2>hello {videos}</h2> */}
        <VideoFeed videos={videos}/>
      </main>
    </div>
  )
}

