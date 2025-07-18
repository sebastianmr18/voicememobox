"use client"

import { Download, Share2, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/memo/audio-player"
import { MetadataInfo } from "@/components/memo/metadata-info"

interface MemoDetailsProps {
  memo: {
    id: string
    filename: string
    transcription: string
    duration: number
    createdAt: string
    audioUrl: string
    metadata: {
      size: number
      format: string
    }
  }
  isOpen: boolean
  onClose: () => void
}

export function MemoDetails({ memo, isOpen, onClose }: MemoDetailsProps) {
  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading memo:", memo.id)
  }

  const handleShare = () => {
    // Implement share functionality
    console.log("Sharing memo:", memo.id)
  }

  const handleDelete = () => {
    // Implement delete functionality
    console.log("Deleting memo:", memo.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl">{memo.filename}</DialogTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{memo.metadata.format}</Badge>
                <span className="text-sm text-gray-500">
                  {new Date(memo.createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Audio Player */}
          <div className="bg-gray-50 rounded-lg p-4">
            <AudioPlayer audioUrl={memo.audioUrl} />
          </div>

          {/* Metadata */}
          <MetadataInfo memo={memo} />

          {/* Transcription */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Transcripción</h3>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{memo.transcription}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
