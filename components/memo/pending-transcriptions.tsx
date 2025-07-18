"use client"

import { useState, useEffect } from "react"
import { Clock, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EmptyState } from "@/components/states/empty-state"

interface PendingMemo {
  id: string
  filename: string
  uploadedAt: string
  progress: number
  status: "uploading" | "transcribing" | "processing"
}

export function PendingTranscriptions() {
  const [pendingMemos, setPendingMemos] = useState<PendingMemo[]>([
    {
      id: "1",
      filename: "nota-reunion-2025-01-09.mp3",
      uploadedAt: "2025-01-09T10:30:00Z",
      progress: 75,
      status: "transcribing",
    },
    {
      id: "2",
      filename: "idea-proyecto.wav",
      uploadedAt: "2025-01-09T11:15:00Z",
      progress: 30,
      status: "processing",
    },
  ])

  useEffect(() => {
    // Simulate progress updates
    const interval = setInterval(() => {
      setPendingMemos((prev) =>
        prev
          .map((memo) => ({
            ...memo,
            progress: Math.min(memo.progress + Math.random() * 10, 100),
          }))
          .filter((memo) => memo.progress < 100),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (pendingMemos.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No hay transcripciones pendientes"
        description="Todas tus notas han sido procesadas correctamente"
      />
    )
  }

  const getStatusText = (status: PendingMemo["status"]) => {
    switch (status) {
      case "uploading":
        return "Subiendo..."
      case "transcribing":
        return "Transcribiendo..."
      case "processing":
        return "Procesando..."
      default:
        return "En proceso..."
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pendingMemos.map((memo) => (
        <Card key={memo.id} className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="truncate">{memo.filename}</span>
            </CardTitle>
            <CardDescription>{getStatusText(memo.status)}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Progress value={memo.progress} className="h-2" />

            <div className="flex justify-between text-sm text-gray-500">
              <span>{Math.round(memo.progress)}% completado</span>
              <span>
                {new Date(memo.uploadedAt).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
