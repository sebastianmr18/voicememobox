"use client";

import { Play, Pause, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranscriptionContext } from "@/context/TranscriptionContext";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MetadataInfo } from "@/components/memo/metadata-info";
import { Badge } from "@/components/ui/badge";

export function LatestTranscriptionCard() {
  const { latestTranscription } = useTranscriptionContext();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Obtener URL presignada para el audio
  const fetchAudioUrl = async (key: string) => {
    setLoadingAudio(true);
    try {
      const res = await fetch(`/api/audio?key=${key}`);
      const data = await res.json();
      setAudioUrl(data.url);
    } catch (error) {
      console.error("Error fetching audio URL:", error);
    } finally {
      setLoadingAudio(false);
    }
  };

  // Control de reproducción de audio
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((e) => console.error("Playback failed:", e));
    }

    setIsPlaying(!isPlaying);
  };

  // Cargar audio cuando haya una nueva transcripción
  useEffect(() => {
    if (latestTranscription?.id) {
      fetchAudioUrl(latestTranscription.id);
    }

    // Limpiar estado de reproducción al cambiar transcripción
    setIsPlaying(false);
  }, [latestTranscription]);

  // Manejar eventos del reproductor de audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  if (!latestTranscription) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sin transcripciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Sube una nota de voz para ver la transcripción aquí
          </p>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = format(
    new Date(latestTranscription.uploadedAt),
    "d 'de' MMMM yyyy 'a las' HH:mm",
    { locale: es },
  );

  // Determinar estado de transcripción
  const transcriptionStatus = latestTranscription.transcript
    ? "completed"
    : "started";

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Tu última transcripción</CardTitle>
            <CardDescription>Creada el {formattedDate}</CardDescription>
          </div>

          <Badge
            variant={
              transcriptionStatus === "completed" ? "default" : "secondary"
            }
          >
            {transcriptionStatus === "completed" ? "Completo" : "Procesando"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Reproductor de audio */}
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            onClick={togglePlay}
            disabled={loadingAudio || !audioUrl}
          >
            {loadingAudio ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm text-gray-500">
            {loadingAudio
              ? "Cargando audio..."
              : isPlaying
                ? "Reproduciendo..."
                : "Reproducir nota original"}
          </span>
          <audio ref={audioRef} src={audioUrl || undefined} />
        </div>

        {/* Metadatos usando MetadataInfo */}
        <MetadataInfo
          status={transcriptionStatus}
          uploadedAt={latestTranscription.uploadedAt}
          filename={latestTranscription.filename}
        />

        {/* Transcripción */}
        <div className="border-t pt-3">
          <h3 className="font-medium mb-2">Transcripción:</h3>

          {latestTranscription.transcript ? (
            <p className="text-sm whitespace-pre-line bg-muted/50 p-3 rounded">
              {latestTranscription.transcript}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Procesando transcripción...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
