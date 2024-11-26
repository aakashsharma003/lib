"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchVideos } from "@/app/utils/youtube";

export function VideoFeed({ initialVideos, searchQuery }) {
  const [videos, setVideos] = useState(initialVideos);
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentSearchQuery = searchParams.get("search") || searchQuery;
    if (currentSearchQuery !== searchQuery) {
      fetchVideos(currentSearchQuery).then(setVideos);
    }
  }, [searchParams, searchQuery]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos?.map((video) => (
        <Link
          key={video?.id?.videoId}
          href={`/video/${video.id.videoId}`}
          className="group"
        >
          <div className="relative aspect-video mb-2">
            <Image
              src={video?.snippet?.thumbnails?.medium?.url}
              alt={video?.snippet?.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <h3 className="font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors">
            {video?.snippet?.title}
          </h3>
          <p className="text-sm text-gray-500">
            {video?.snippet?.channelTitle}
          </p>
        </Link>
      ))}
    </div>
  );
}
