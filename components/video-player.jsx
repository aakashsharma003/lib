"use client"

import { useEffect, useCallback } from "react"

export function VideoPlayer({ videoId }) {

  const loadVideo = useCallback(() => {
    new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1, // ENABLE native controls
        modestbranding: 1, // keep minimal branding
        rel: 0, // disable related videos
        showinfo: 0,
      }
    });
  }, [videoId]);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      loadVideo();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = loadVideo;
    }
  }, [loadVideo]);

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
      <div id="youtube-player" className="w-full h-full" />
    </div>
  );
}

