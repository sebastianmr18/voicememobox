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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface TranscripitionCardProps {
  isUploading: boolean;
}

interface AmazonTranscribeMetadata {
  jobName: string;
  accountId: string;
  status: string;
  results: {
    transcripts: [{ transcript: string }];
    items: Array<{
      id: number;
      type: "pronunciation" | "punctuation";
      alternatives: [{ confidence: string; content: string }];
      start_time?: string;
      end_time?: string;
    }>;
    audio_segments?: Array<{
      id: number;
      transcript: string;
      start_time: string;
      end_time: string;
      items: number[];
    }>;
  };
}

function TranscriptionSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skeleton del reproductor de audio */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Skeleton de la transcripción */}
        <div className="border-t pt-3 space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="bg-muted/50 p-3 rounded space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-4 w-4 rounded-full animate-spin" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Skeleton de progreso animado */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
          <span className="text-primary font-medium">Procesando tu nota de voz...</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function LatestTranscriptionCard({ isUploading }: TranscripitionCardProps) {
  const { latestTranscription } = useTranscriptionContext();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptionMetadata, setTranscriptionMetadata] =
    useState<AmazonTranscribeMetadata | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Obtener URL presignada para el audio
  const fetchAudioUrl = async (key: string) => {
    setLoadingAudio(true);
    try {
      const res = await fetch(`/api/retrieve-audio?key=${key}`);
      const data = await res.json();
      setAudioUrl(data.url);
    } catch (error) {
      console.error("Error fetching audio URL:", error);
    } finally {
      setLoadingAudio(false);
    }
  };

  // Obtener metadatos de transcripción (incluyendo confianza)
  const fetchTranscriptionMetadata = async (filename: string) => {
    try {
      const res = await fetch(`/api/transcription-metadata?filename=${filename}`);
      const data = await res.json();
      if (data.metadata) {
        setTranscriptionMetadata(data.metadata);
              toast({
        title: "Exito",
        description: "Tu transcripción se ha generado correctamente",
        variant: "default",
      })
      }
    } catch (error) {
      console.error("Error fetching transcription metadata:", error);
      setTranscriptionMetadata(null);
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
      if (latestTranscription.filename) {
        fetchTranscriptionMetadata(latestTranscription.filename);
      }
    }
    // Limpiar estado de reproducción al cambiar transcripción
    setIsPlaying(false);
    setTranscriptionMetadata(null);
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

  if (isUploading) return <TranscriptionSkeleton />;

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

  const getConfidenceBgClass = (confidence: number): string => {
    if (confidence >= 0.9) {
      return "bg-green-200"; // Alta confianza
    } else if (confidence >= 0.7) {
      return "bg-yellow-200"; // Confianza media
    } else {
      return "bg-red-200"; // Baja confianza
    }
  }; 

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

        {/* Transcripción con sombreado de confianza y tooltip */}
        <div className="border-t pt-3">
          <h3 className="font-medium mb-2">Transcripción:</h3>

          {transcriptionMetadata?.results?.items ? (
            <p className="text-sm whitespace-pre-line bg-muted/50 p-3 rounded">
              {transcriptionMetadata.results.items.map((item, index) => {
                const content = item.alternatives[0]?.content;
                const confidence = parseFloat(item.alternatives[0]?.confidence || "0");

                if (item.type === "pronunciation") {
                  return (
                    <span
                      key={index}
                      className={`relative inline-block px-0.5 rounded ${getConfidenceBgClass(confidence)} group`} // Añade 'group' para el tooltip
                    >
                      {content}
                      {/* Tooltip para mostrar la confianza */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        Confianza: {(confidence * 100).toFixed(2)}%
                      </span>
                      {" "} {/* Espacio después de la palabra */}
                    </span>
                  );
                } else {
                  return <span key={index}>{content} </span>;
                }
              })}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {transcriptionStatus === "completed"
                  ? "Cargando metadatos de transcripción..."
                  : "Procesando transcripción..."}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
