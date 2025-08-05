"use client";

import { Suspense, useState } from "react";
import { UploadMemoCard } from "@/components/memo/uploadMemoCard";
import { LoadingState } from "@/components/states/loadingState";
import { LatestTranscriptionCard } from "@/components/memo/transcriptionCard";

export default function TrancriptionPage() {
  const [isUploading, setIsUploading] = useState(false);
  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <section aria-labelledby="upload-heading">
        <h2
          id="upload-heading"
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          Nueva Nota de Voz
        </h2>
        <UploadMemoCard
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
      </section>

      {/* Pending Transcriptions */}
      <section aria-labelledby="pending-heading">
        <h2
          id="pending-heading"
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          Tu transcripción
        </h2>
        <LatestTranscriptionCard isUploading={isUploading} />
      </section>
    </div>
  );
}
