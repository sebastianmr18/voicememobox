"use client";

import { createContext, useContext, useState } from "react";
import { Transcription } from "@/types/transcription";

interface ContextType {
  latestTranscription: Transcription | undefined;
  addTranscription: (t: Transcription) => void;
}

const TranscriptionContext = createContext<ContextType | null>(null);

export const useTranscriptionContext = () => {
  const context = useContext(TranscriptionContext);
  if (!context)
    throw new Error(
      "useTranscriptionContext must be used within a TranscriptionProvider",
    );
  return context;
};

export const TranscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [latestTranscription, setLatestTranscription] =
    useState<Transcription>();

  const addTranscription = (t: Transcription) => {
    setLatestTranscription(t);
  };

  return (
    <TranscriptionContext.Provider
      value={{ latestTranscription, addTranscription }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};
