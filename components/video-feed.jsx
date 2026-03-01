"use client";

import { useState, useEffect, useCallback } from "react";
import { Youtube, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchVideos } from "@/app/utils/youtube";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const decodeHtml = (html) => {
  if (!html) return '';
  return html.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};

export function VideoFeed({ initialVideos = [], initialPageToken = null, searchQuery }) {
  const [videos, setVideos] = useState(initialVideos);
  const [pageToken, setPageToken] = useState(initialPageToken);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  // Handle fresh searches cleanly
  useEffect(() => {
    const currentSearchQuery = searchParams.get("search");

    if (currentSearchQuery !== null && currentSearchQuery !== searchQuery) {
      // New search entirely, reset
      fetchVideos(currentSearchQuery).then((res) => {
        setVideos(res.items);
        setPageToken(res.nextPageToken);
      });
    } else {
      // Revert to initial SSR state if cleared or matching
      setVideos(initialVideos);
      setPageToken(initialPageToken);
    }
  }, [searchParams, searchQuery, initialVideos, initialPageToken]);

  const loadMoreVideos = useCallback(async () => {
    if (isLoadingMore || !pageToken) return;
    setIsLoadingMore(true);

    const currentSearchQuery = searchParams.get("search") || searchQuery || "";
    try {
      const res = await fetchVideos(currentSearchQuery, pageToken);
      if (res.items.length > 0) {
        setVideos((prev) => [...prev, ...res.items]);
        setPageToken(res.nextPageToken);
      } else {
        setPageToken(null);
      }
    } catch (e) {
      console.error("Failed to load more videos:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, pageToken, searchParams, searchQuery]);

  // Trigger load more when scroll reaches bottom trigger
  useEffect(() => {
    if (inView) {
      loadMoreVideos();
    }
  }, [inView, loadMoreVideos]);

  return (
    <div className="flex flex-col space-y-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos?.map((video, index) => {
          const isYouTube = video.platform === 'youtube' || !video.platform;
          const platformDomain = video.platform === 'youtube' ? 'youtube.com' : (video.platform === 'udemy' ? 'udemy.com' : 'coursera.org');

          const platformIcon = (
            <img
              src={`https://www.google.com/s2/favicons?domain=${platformDomain}&sz=128`}
              alt={video.platform || 'youtube'}
              className="w-5 h-5 rounded-sm object-contain"
            />
          );

          const CardContent = (
            <div className="group flex flex-col h-full bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={video?.snippet?.thumbnails?.high?.url || video?.snippet?.thumbnails?.medium?.url || "/placeholder.svg"}
                  alt={video?.snippet?.title || "Video thumbnail"}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm p-1 rounded shadow-sm">
                  {platformIcon}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                  {decodeHtml(video?.snippet?.title)}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-sm text-muted-foreground font-medium truncate pr-2">
                    {video?.snippet?.channelTitle}
                  </p>
                  {!isYouTube && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                      {video.platform}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );

          return (
            <motion.div
              key={`${video?.id?.videoId}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index % 15 * 0.05 }}
            >
              {isYouTube ? (
                <Link href={`/video/${video.id?.videoId}`}>
                  {CardContent}
                </Link>
              ) : (
                <div onClick={() => toast.info("We are working to bring these as well!", {
                  description: `Support for ${video.platform || 'other platforms'} videos is coming soon.`
                })}>
                  {CardContent}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Infinite Scroll Trigger */}
      {pageToken && (
        <div ref={ref} className="w-full flex justify-center py-6">
          {isLoadingMore ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="h-6" /> // Placeholder to maintain height
          )}
        </div>
      )}
    </div>
  );
}
