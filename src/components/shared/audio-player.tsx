"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  src: string
  onProgress?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  autoSaveInterval?: number // seconds
  className?: string
}

export function AudioPlayer({
  src,
  onProgress,
  onComplete,
  autoSaveInterval = 10,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const lastSaveTime = useRef(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration)

      // Auto-save progress
      const now = Date.now()
      if (now - lastSaveTime.current >= autoSaveInterval * 1000) {
        onProgress?.(audio.currentTime, audio.duration)
        lastSaveTime.current = now
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
      onProgress?.(duration, duration)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", () => {})
      audio.removeEventListener("ended", handleEnded)
    }
  }, [duration, onProgress, onComplete, autoSaveInterval])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
    onProgress?.(newTime, duration)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={cn(
        "w-full bg-muted rounded-lg p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="default"
          size="icon"
          onClick={togglePlay}
          className="flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <div className="flex-1 space-y-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercentage}
            onChange={handleSeek}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="flex-shrink-0"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Progress value={progressPercentage} className="h-1" />
    </div>
  )
}

