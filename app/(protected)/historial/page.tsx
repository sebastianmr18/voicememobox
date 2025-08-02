import { Suspense } from "react";
import { LoadingState } from "@/components/states/loading-state";
import { HistoryHeader } from "@/components/history/history-header";
import { HistoryList } from "@/components/history/history-list";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <HistoryHeader />
      <Suspense fallback={<LoadingState message="Cargando historial..." />}>
        <HistoryList />
      </Suspense>
    </div>
  );
}
