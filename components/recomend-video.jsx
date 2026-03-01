import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Youtube, BookOpen } from "lucide-react"
import { toast } from "sonner"

const decodeHtml = (html) => {
  if (!html) return '';
  return html.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};


export function RecommendedVideos({ videos }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 px-2">Recommended videos</h2>
      <div className="flex flex-col">
        {videos?.map((video) => {
          const isYouTube = video.platform === 'youtube' || !video.platform;
          const platformDomain = video.platform === 'youtube' ? 'youtube.com' : (video.platform === 'udemy' ? 'udemy.com' : 'coursera.org');

          const platformIcon = (
            <img
              src={`https://www.google.com/s2/favicons?domain=${platformDomain}&sz=128`}
              alt={video.platform || 'youtube'}
              className="w-3.5 h-3.5 rounded-sm object-contain"
            />
          );

          const content = (
            <div className={`flex items-start group hover:bg-secondary/10 p-1.5 -mx-1.5 rounded-lg transition-colors ${!isYouTube && 'cursor-pointer'}`}>
              <div className="relative flex-shrink-0 mr-2.5">
                <Image
                  src={video?.thumbnail}
                  alt={video?.title}
                  width={160}
                  height={90}
                  className="rounded-lg object-cover"
                />
                <div className="absolute bottom-1 right-1 flex items-center gap-1 bg-black/80 backdrop-blur-sm px-1 py-0.5 rounded">
                  {platformIcon}
                  <span className="text-white text-[10px] font-medium tracking-wide">
                    {video.duration || "12:34"}
                  </span>
                </div>
              </div>
              <div className="flex-grow min-w-0 pt-0.5">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {decodeHtml(video.title)}
                </h3>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-muted-foreground truncate">{video.channelTitle}</p>
                  {!isYouTube && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                      {video.platform}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                </p>
              </div>
            </div>
          );

          return isYouTube ? (
            <Link key={video?.videoId} href={`/video/${video?.videoId}`}>
              {content}
            </Link>
          ) : (
            <div
              key={video?.videoId || Math.random()}
              onClick={() => toast.info("We are working to bring these as well!", {
                description: `Support for ${video.platform || 'other platforms'} videos is coming soon.`
              })}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  )
}

