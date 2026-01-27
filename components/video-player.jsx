"use client"

import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react'
 import Script from "next/script";

export function VideoPlayer({videoId}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = loadVideo;
    }, [loadVideo]);

    useEffect(() => {
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
      }
    }, [videoId]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, [isControlsVisible]);

    const loadVideo = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    const onPlayerReady = (event) => {
      setDuration(event.target.getDuration());
      setVolume(event.target.getVolume());
      setIsPlaying(true);
      // Start updating current time
      setInterval(handleTimeUpdate, 1000);
    };

    const onPlayerStateChange = (event) => {
      setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    };

    const togglePlay = () => {
      if (playerRef.current) {
        if (isPlaying) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleTimeUpdate = () => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    };

    const handleVolumeChange = (newVolume) => {
      if (playerRef.current) {
        playerRef.current.setVolume(newVolume[0]);
        setVolume(newVolume[0]);
      }
    };

    const handleSeek = (newTime) => {
      if (playerRef.current) {
        playerRef.current.seekTo(newTime[0], true);
        setCurrentTime(newTime[0]);
      }
    };

    const formatTime = (time) => {
      if (isNaN(time)) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen();
        setIsFullScreen(true);
      } else {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    };

    const handleMouseEnter = () => setIsControlsVisible(true);
    const handleMouseLeave = () => setIsControlsVisible(false);

    return (
      <div
        ref={containerRef}
        className="relative aspect-video rounded-lg overflow-hidden bg-black"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div id="youtube-player" className="w-full h-full" />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            isControlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="mb-4"
          />
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <Button variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  playerRef.current &&
                  playerRef.current.seekTo(
                    playerRef.current.getCurrentTime() - 10,
                    true
                  )
                }
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  playerRef.current &&
                  playerRef.current.seekTo(
                    playerRef.current.getCurrentTime() + 10,
                    true
                  )
                }
              >
                <SkipForward className="h-6 w-6" />
              </Button>
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVolumeChange([volume === 0 ? 100 : 0])}
              >
                {volume === 0 ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
              <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
}

