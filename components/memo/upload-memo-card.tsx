"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useTranscriptionContext } from "@/context/TranscriptionContext";

export function UploadMemoCard() {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { addTranscription } = useTranscriptionContext();

  const waitForTranscript = async (
    filename: string,
  ): Promise<string | null> => {
    for (let i = 0; i < 20; i++) {
      const res = await fetch(`/api/show-transcription?filename=${filename}`);
      const data = await res.json();
      if (data.transcript) return data.transcript;
      await new Promise((r) => setTimeout(r, 15000));
    }
    return null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAudio(file);
    }
  };

  const uploadAudio = async (audioData: Blob | File, userId = "anonymous") => {
    setIsUploading(true);
    try {
      // Solicitud de URL prefirmada
      const fileType = audioData.type;
      const { data } = await axios.get("/api/upload-audio", {
        params: { fileType, userId },
      });
      const { url, key } = data;

      // Subida de archivo a S3
      const uploadRes = await axios.put(url, audioData, {
        headers: {
          "Content-Type": fileType,
        },
      });

      if (uploadRes.status !== 200) throw new Error("Upload failed");

      toast({
        title: "¡Éxito!",
        description:
          "Nota de voz subida correctamente. La transcripción comenzará en breve.",
      });

      const filename = key
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "");
      if (!filename) return;

      const transcript = await waitForTranscript(filename);

      addTranscription({
        id: key,
        filename,
        transcript,
        uploadedAt: new Date().toISOString(),
      });
      return key;
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al subir la nota de voz",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="h-5 w-5" />
          <span>Subir Nota de Voz</span>
        </CardTitle>
        <CardDescription>
          Graba una nueva nota o sube un archivo de audio existente
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Recording Section */}
        <div className="text-center space-y-4">
          {isRecording && (
            <div className="text-2xl font-mono text-red-600">
              {formatTime(recordingTime)}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-red-600 hover:bg-red-700"
                disabled={isUploading}
              >
                <Mic className="h-5 w-5 mr-2" />
                Comenzar Grabación
              </Button>
            ) : (
              <Button onClick={stopRecording} size="lg" variant="destructive">
                <MicOff className="h-5 w-5 mr-2" />
                Detener Grabación
              </Button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">o</span>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="text-center space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Seleccionar archivo de audio"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="lg"
            disabled={isRecording || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Subir Archivo
              </>
            )}
          </Button>

          <p className="text-sm text-gray-500">
            Formatos soportados: MP3, WAV, M4A (máx. 25MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
