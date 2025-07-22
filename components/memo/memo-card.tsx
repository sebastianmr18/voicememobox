"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetadataInfo } from "@/components/memo/metadata-info";
import { useToast } from "@/hooks/use-toast";

interface MemoCardProps {
  memo: {
    id: string;
    filename: string;
    uploadedAt: string;
    transcriptionStatus: string;
    transcript?: string;
  };
}

export function MemoCard({ memo }: MemoCardProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Playback failed:", e));
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base truncate max-w-[70%]">
              {memo.filename.split("/").pop()}
            </CardTitle>
            <CardDescription>
              {new Date(memo.uploadedAt).toLocaleString()}
            </CardDescription>
          </div>

          <Button
            size="icon"
            variant={isPlaying ? "destructive" : "outline"}
            onClick={togglePlay}
            disabled={!audioUrl}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetadataInfo
          status={memo.transcriptionStatus}
          uploadedAt={memo.uploadedAt}
          filename={memo.filename}
        />

        <div className="border-t pt-3">
          <h3 className="font-medium mb-2">Transcripción:</h3>

          {isLoading ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Cargando transcripción...</span>
            </div>
          ) : memo.transcript ? (
            <p className="text-sm whitespace-pre-line bg-muted/50 p-3 rounded">
              {memo.transcript}
            </p>
          ) : memo.transcriptionStatus === "completed" ? (
            <p className="text-sm text-muted-foreground italic">
              Transcripción no disponible
            </p>
          ) : (
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded-full animate-pulse w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
