import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"


export function RecommendedVideos({videos}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended videos</h2>
      <div className="space-y-4">
        {videos?.map((video) => (
          <Link key={video?.videoId} href={`/video/${video?.videoId}`} className="flex space-x-2 group" >
            <div className="relative flex-shrink-0">
              <Image
                src={video?.thumbnail}
                alt={video?.title}
                width={180}
                height={90}
                className="rounded-lg object-cover"
              />
              <Badge 
                variant="secondary" 
                className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white"
              >
                {video.duration}
              </Badge>
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-500 truncate">{video.channel}</p>
              <p className="text-sm text-gray-500 truncate">
                {video.views} • {video.timestamp}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

