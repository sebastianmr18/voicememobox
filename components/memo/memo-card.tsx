"use client"

import { Clock, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MemoCardProps {
  memo: {
    id: string
    filename: string
    transcription: string
    duration: number
    createdAt: string
    metadata: {
      size: number
      format: string
    }
  }
  onClick: () => void
}

export function MemoCard({ memo, onClick }: MemoCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base line-clamp-1">{memo.filename}</CardTitle>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {memo.metadata.format}
          </Badge>
        </div>
        <CardDescription className="flex items-center space-x-4 text-sm">
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(memo.duration)}</span>
          </span>
          <span>{memo.metadata.size}MB</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">{memo.transcription}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{formatDate(memo.createdAt)}</span>

          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-1" />
            Ver detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
