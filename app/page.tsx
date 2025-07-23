"use client";

import { Suspense, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { UploadMemoCard } from "@/components/memo/upload-memo-card";
import { LoadingState } from "@/components/states/loading-state";
import { LatestTranscriptionCard } from "@/components/memo/transcription-card";

export default function HomePage() {
  const [isUploading, setIsUploading] = useState(false);
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Upload Section */}
        <section aria-labelledby="upload-heading">
          <h2
            id="upload-heading"
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            Nueva Nota de Voz
          </h2>
          <UploadMemoCard isUploading={isUploading} setIsUploading={setIsUploading} />
        </section>

        {/* Pending Transcriptions */}
        <section aria-labelledby="pending-heading">
          <h2
            id="pending-heading"
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            Tu transcripción
          </h2>
          <Suspense
            fallback={
              <LoadingState message="Cargando transcripciones pendientes..." />
            }
          >
            <LatestTranscriptionCard isUploading={isUploading} />
          </Suspense>
        </section>
      </div>
    </AppLayout>
  );
}
