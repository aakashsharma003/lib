"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Youtube, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { fetchVideos } from "@/app/utils/youtube";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createSecureVideoLink } from "@/app/actions/video";
import { decodeHtml } from "@/lib/utils";

export function VideoFeed({ initialVideos = [], initialPageToken = null, searchQuery, initialBlocked = false }) {
  const [videos, setVideos] = useState(initialVideos);
  const [pageToken, setPageToken] = useState(initialPageToken);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isBlocked, setIsBlocked] = useState(initialBlocked);
  const [loadingVideoId, setLoadingVideoId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Rate limit queue state
  const [isQueued, setIsQueued] = useState(false);
  const pendingSearchRef = useRef(null);
  const toastIdRef = useRef(null);
  const countdownRef = useRef(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { ref, inView } = useInView();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Show a countdown toast and auto-retry when it reaches 0
  const startQueueCountdown = (retrySeconds, query, token) => {
    setIsQueued(true);
    pendingSearchRef.current = { query, token };
    let remaining = retrySeconds;

    // Show initial toast
    toastIdRef.current = toast.loading(
      `Your request is in queue. Please wait ${remaining}s...`,
      { duration: Infinity, id: 'rate-limit-queue' }
    );

    countdownRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        toast.dismiss('rate-limit-queue');

        // Auto-retry
        setIsQueued(false);
        if (pendingSearchRef.current) {
          const { query: q, token: t } = pendingSearchRef.current;
          pendingSearchRef.current = null;
          executeSearch(q, t).then((res) => {
            if (res) {
              setVideos(prev => t ? [...prev, ...res.items] : res.items);
              setPageToken(res.nextPageToken);
              setIsBlocked(!!res.blockedByAI);
            }
          });
        }
      } else {
        // Update the existing toast with new countdown
        toast.loading(
          `Your request is in queue. Please wait ${remaining}s...`,
          { id: 'rate-limit-queue' }
        );
      }
    }, 1000);
  };

  // Execute search with rate limit handling
  const executeSearch = async (query, pageToken = "") => {
    setIsSearching(true);
    try {
      const res = await fetchVideos(query, pageToken);

      if (res.rateLimited) {
        startQueueCountdown(res.retryAfter || 30, query, pageToken);
        return null;
      }

      return res;
    } finally {
      setIsSearching(false);
    }
  };

  // Handle fresh searches cleanly
  useEffect(() => {
    const currentSearchQuery = searchParams.get("search");

    if (currentSearchQuery !== null && currentSearchQuery !== searchQuery) {
      setIsSearching(true);
      executeSearch(currentSearchQuery).then((res) => {
        if (res) {
          setVideos(res.items);
          setPageToken(res.nextPageToken);
          setIsBlocked(!!res.blockedByAI);
        }
        setIsSearching(false);
      });
    } else {
      setVideos(initialVideos);
      setPageToken(initialPageToken);
      setIsBlocked(initialBlocked);
    }
  }, [searchParams, searchQuery, initialVideos, initialPageToken, initialBlocked]);

  const loadMoreVideos = useCallback(async () => {
    if (isLoadingMore || !pageToken || isQueued) return;
    setIsLoadingMore(true);

    const currentSearchQuery = searchParams.get("search") || searchQuery || "";
    try {
      const res = await executeSearch(currentSearchQuery, pageToken);
      if (res) {
        if (res.items.length > 0) {
          setVideos((prev) => [...prev, ...res.items]);
          setPageToken(res.nextPageToken);
        } else {
          setPageToken(null);
        }
      }
    } catch (e) {
      console.error("Failed to load more videos:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, pageToken, searchParams, searchQuery, isQueued]);

  // Trigger load more when scroll reaches bottom trigger
  useEffect(() => {
    if (inView && !isQueued) {
      loadMoreVideos();
    }
  }, [inView, loadMoreVideos, isQueued]);

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh] border border-destructive/50 bg-destructive/5 rounded-2xl">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight text-destructive-foreground">Educational Content Only</h2>
        <p className="text-muted-foreground max-w-lg mb-4">
          This platform is strictly dedicated to learning, tutorials, and professional growth.
          Your search query was blocked as it does not appear to be related to educational content.
        </p>
        <p className="text-destructive font-semibold max-w-lg p-3 bg-destructive/10 rounded-md">
          ⚠️ Warning: If you willingly attempt to search for non-educational content more than 2 times, we may have to lock your profile. Because you are trying to misuse the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">

      {/* Search Loading State */}
      {isSearching && videos.length === 0 && !isQueued && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Searching for videos...</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos?.map((video, index) => {
          const isYouTube = video.platform === 'youtube' || !video.platform;
          const platformDomain = video.platform === 'youtube' ? 'youtube.com' : (video.platform === 'udemy' ? 'udemy.com' : 'coursera.org');

          const platformIcon = (
            <Image
              src={`https://www.google.com/s2/favicons?domain=${platformDomain}&sz=128`}
              alt={video.platform || 'youtube'}
              width={20}
              height={20}
              className="rounded-sm object-contain"
            />
          );

          const isNavigating = loadingVideoId === video?.id?.videoId;

          const CardContent = (
            <div className={`group flex flex-col h-full bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isNavigating ? 'opacity-70 pointer-events-none' : ''}`}>
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={video?.snippet?.thumbnails?.high?.url || video?.snippet?.thumbnails?.medium?.url || "/placeholder.svg"}
                  alt={video?.snippet?.title || "Video thumbnail"}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isNavigating ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {isNavigating ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                      <span className="text-xs text-white/80 font-medium animate-pulse">Opening video...</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  )}
                </div>
                <div className="tour-platform-tag absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm p-1 rounded shadow-sm">
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
                <div onClick={async () => {
                  if (isNavigating) return;
                  setLoadingVideoId(video.id.videoId);
                  try {
                    const encryptedId = await createSecureVideoLink(video.id.videoId);
                    router.push(`/video/${encryptedId}`);
                  } catch (e) {
                    toast.error("Failed to secure link. Access denied.");
                    setLoadingVideoId(null);
                  }
                }}>
                  {CardContent}
                </div>
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
            <div className="h-6" />
          )}
        </div>
      )}
    </div>
  );
}
