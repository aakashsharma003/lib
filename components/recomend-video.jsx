import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const recommendedVideos = [
  {
    id: 1,
    title: "The Next Big Thing in Animation",
    channel: "Future Animations",
    views: "1.2M views",
    timestamp: "3 days ago",
    thumbnail: "/placeholder.svg?height=120&width=240",
    duration: "12:34",
  },
  {
    id: 2,
    title: "Behind the Scenes: Making of Big Buck Bunny",
    channel: "Blender Insider",
    views: "500K views",
    timestamp: "1 week ago",
    thumbnail: "/placeholder.svg?height=120&width=240",
    duration: "22:15",
  },
  {
    id: 3,
    title: "Top 10 Animated Short Films of All Time",
    channel: "Animation Critic",
    views: "2.5M views",
    timestamp: "2 weeks ago",
    thumbnail: "/placeholder.svg?height=120&width=240",
    duration: "15:45",
  },
  {
    id: 4,
    title: "The Art of 3D Character Design",
    channel: "3D Masterclass",
    views: "750K views",
    timestamp: "1 month ago",
    thumbnail: "/placeholder.svg?height=120&width=240",
    duration: "18:30",
  },
]

export function RecommendedVideos() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended videos</h2>
      <div className="space-y-4">
        {recommendedVideos.map((video) => (
          <Link key={video.id} href="#" className="flex space-x-2 group">
            <div className="relative flex-shrink-0">
              <Image
                src={video.thumbnail}
                alt={video.title}
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

