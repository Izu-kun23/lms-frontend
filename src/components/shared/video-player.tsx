"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  src: string
  onProgress?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  autoSaveInterval?: number // seconds
  className?: string
}

export function VideoPlayer({
  src,
  onProgress,
  onComplete,
  autoSaveInterval = 10,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const lastSaveTime = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      setDuration(video.duration)

      // Auto-save progress
      const now = Date.now()
      if (now - lastSaveTime.current >= autoSaveInterval * 1000) {
        onProgress?.(video.currentTime, video.duration)
        lastSaveTime.current = now
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
      onProgress?.(duration, duration)
    }

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", () => {
      setDuration(video.duration)
    })
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", () => {})
      video.removeEventListener("ended", handleEnded)
    }
  }, [duration, onProgress, onComplete, autoSaveInterval])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
    onProgress?.(newTime, duration)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn("w-full bg-black rounded-lg overflow-hidden", className)}>
      <video
        ref={videoRef}
        src={src}
        className="w-full"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="bg-black/80 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <span className="text-white text-sm min-w-[80px] text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Progress value={progressPercentage} className="h-1" />
      </div>
    </div>
  )
}

