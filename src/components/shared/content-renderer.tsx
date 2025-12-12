"use client"

import { VideoPlayer } from "./video-player"
import { AudioPlayer } from "./audio-player"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Content } from "@/types/course"

interface ContentRendererProps {
  content: Content
  onProgress?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  className?: string
}

export function ContentRenderer({
  content,
  onProgress,
  onComplete,
  className,
}: ContentRendererProps) {
  switch (content.type) {
    case "TEXT":
      return (
        <Card className={className}>
          <CardContent className="p-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: content.text || "",
              }}
            />
          </CardContent>
        </Card>
      )

    case "VIDEO":
      if (!content.mediaUrl) {
        return (
          <Card className={className}>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Video URL not available</p>
            </CardContent>
          </Card>
        )
      }
      return (
        <VideoPlayer
          src={content.mediaUrl}
          onProgress={onProgress}
          onComplete={onComplete}
          className={className}
        />
      )

    case "AUDIO":
      if (!content.mediaUrl) {
        return (
          <Card className={className}>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Audio URL not available</p>
            </CardContent>
          </Card>
        )
      }
      return (
        <AudioPlayer
          src={content.mediaUrl}
          onProgress={onProgress}
          onComplete={onComplete}
          className={className}
        />
      )

    case "FILE":
      return (
        <Card className={className}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <div className="flex-1">
                <h3 className="font-medium">{content.text || "File"}</h3>
                {content.mediaUrl && (
                  <p className="text-sm text-muted-foreground">
                    {content.mediaUrl}
                  </p>
                )}
              </div>
              {content.mediaUrl && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={content.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={content.mediaUrl}
                      download
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )

    case "LIVE":
      return (
        <Card className={className}>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">Live Session</h3>
              {content.mediaUrl ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Join the live session using the link below
                  </p>
                  <Button asChild>
                    <a
                      href={content.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Join Live Session
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Live session link not available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )

    default:
      return (
        <Card className={className}>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Unsupported content type: {content.type}
            </p>
          </CardContent>
        </Card>
      )
  }
}

