import { Suspense } from "react";
import { LoadingState } from "@/components/states/loadingState";
import { HistoryHeader } from "@/components/history/historyHeader";
import { HistoryList } from "@/components/history/historyList";

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
