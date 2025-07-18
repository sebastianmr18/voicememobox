"use client"

import { useState } from "react"
import { MemoCard } from "@/components/memo/memo-card"
import { MemoDetails } from "@/components/memo/memo-details"
import { EmptyState } from "@/components/states/empty-state"
import { FileText } from "lucide-react"

interface Memo {
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

const mockMemos: Memo[] = [
  {
    id: "1",
    filename: "reunion-equipo-2025-01-08.mp3",
    transcription:
      "En la reunión de hoy discutimos los objetivos del primer trimestre. Necesitamos enfocar nuestros esfuerzos en mejorar la experiencia del usuario y optimizar el rendimiento de la aplicación. Los puntos clave incluyen la implementación de nuevas funcionalidades y la corrección de bugs críticos.",
    duration: 180,
    createdAt: "2025-01-08T14:30:00Z",
    audioUrl: "/audio/sample1.mp3",
    metadata: {
      size: 2.5,
      format: "MP3",
    },
  },
  {
    id: "2",
    filename: "notas-personales.wav",
    transcription:
      "Recordatorio para mañana: revisar el código del componente de autenticación, programar la reunión con el cliente para el viernes, y no olvidar comprar los materiales para el proyecto personal.",
    duration: 95,
    createdAt: "2025-01-08T09:15:00Z",
    audioUrl: "/audio/sample2.wav",
    metadata: {
      size: 1.8,
      format: "WAV",
    },
  },
  {
    id: "3",
    filename: "idea-startup.m4a",
    transcription:
      "Idea para nueva aplicación: una plataforma que conecte a desarrolladores freelance con pequeñas empresas que necesitan soluciones tecnológicas rápidas. El modelo de negocio podría basarse en comisiones por proyecto completado.",
    duration: 240,
    createdAt: "2025-01-07T16:45:00Z",
    audioUrl: "/audio/sample3.m4a",
    metadata: {
      size: 3.2,
      format: "M4A",
    },
  },
]

export function MemoList() {
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null)

  if (mockMemos.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No tienes notas guardadas"
        description="Sube tu primera nota de voz para comenzar"
      />
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockMemos.map((memo) => (
          <MemoCard key={memo.id} memo={memo} onClick={() => setSelectedMemo(memo)} />
        ))}
      </div>

      {selectedMemo && (
        <MemoDetails memo={selectedMemo} isOpen={!!selectedMemo} onClose={() => setSelectedMemo(null)} />
      )}
    </>
  )
}
