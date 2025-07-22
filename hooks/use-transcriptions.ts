import { useEffect, useState } from "react";

interface Transcription {
  id: string;
  filename: string;
  transcript: string | null;
}

export const useTranscriptions = () => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  return transcriptions;
};
