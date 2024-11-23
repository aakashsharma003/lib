import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react";

export function VideoFeed({videos}) {
  console.log("Videos received in VideoFeed:", videos);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos?.map((video) => (
        <Link key={video?.id?.videoId} href={`/video/${video.id.videoId}`} className="group">
          <div className="relative aspect-video mb-2">
            <Image
              src={video?.snippet?.thumbnails?.medium?.url}
              alt={video?.snippet?.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
              {video?.duration} 
            </div>
          </div>
          <h3 className="font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors">
            {video?.snippet?.title}
          </h3>
          <p className="text-sm text-gray-500">{video.channel}</p>
          <p className="text-sm text-gray-500">
            {video.views} • {video.timestamp}
          </p>
        </Link>
      ))}
    </div>
  )
}

