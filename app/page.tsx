import { Suspense } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { UploadMemoCard } from "@/components/memo/upload-memo-card"
import { PendingTranscriptions } from "@/components/memo/pending-transcriptions"
import { MemoList } from "@/components/memo/memo-list"
import { LoadingState } from "@/components/states/loading-state"

export default function HomePage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Upload Section */}
        <section aria-labelledby="upload-heading">
          <h2 id="upload-heading" className="text-2xl font-bold text-gray-900 mb-4">
            Nueva Nota de Voz
          </h2>
          <UploadMemoCard />
        </section>

        {/* Pending Transcriptions */}
        <section aria-labelledby="pending-heading">
          <h2 id="pending-heading" className="text-2xl font-bold text-gray-900 mb-4">
            Transcripciones en Proceso
          </h2>
          <Suspense fallback={<LoadingState message="Cargando transcripciones pendientes..." />}>
            <PendingTranscriptions />
          </Suspense>
        </section>

        {/* Memo History */}
        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-2xl font-bold text-gray-900 mb-4">
            Historial de Notas
          </h2>
          <Suspense fallback={<LoadingState message="Cargando historial..." />}>
            <MemoList />
          </Suspense>
        </section>
      </div>
    </AppLayout>
  )
}