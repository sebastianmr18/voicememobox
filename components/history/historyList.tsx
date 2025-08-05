"use client";

import { useState, useEffect } from "react";
import { MemoCard } from "@/components/memo/memoCard";
import { MemoDetails } from "@/components/memo/memoDetails";
import { EmptyState } from "@/components/states/emptyState";
import { FileText, Grid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSession } from "next-auth/react";
import { hashEmail } from "@/lib/hash";
import { Button } from "@/components/ui/button";
import { se } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface Memo {
  id: string;
  filename: string;
  transcription: string;
  duration: number;
  createdAt: string;
  audioUrl: string;
  metadata: {
    size: number;
    format: string;
  };
}

function MemoCardSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Skeleton className="h-6 w-16 rounded-md" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Vista grid
  return (
    <div className="border rounded-lg shadow-sm">
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      <div className="p-4 pt-0 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

export function HistoryList() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const getTrancrisptsByUser = async () => {
      setIsLoading(true);
      const email = session?.user?.email ?? "anonymous";
      const userId = await hashEmail(email);
      try {
        const response = await fetch(
          `/api/transcriptions-by-user?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        setMemos(data.memos);
      } catch (error) {
        console.error("Error fetching transcriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      getTrancrisptsByUser();
    }
  }, [session?.user?.email]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* View Toggle Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <div className="flex border rounded-md">
            <Skeleton className="h-8 w-8 rounded-none" />
            <Skeleton className="h-8 w-8 rounded-none" />
          </div>
        </div>

        {/* Memos Grid/List Skeleton */}
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <MemoCardSkeleton key={index} viewMode={viewMode} />
          ))}
        </div>
      </div>
    );
  }

  // Si no hay memos, mostrar estado vacío
  if (memos.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No tienes transcripciones guardadas"
        description="Sube tu primera nota de voz para comenzar a crear tu historial"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {memos.length} transcripciones
        </p>

        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) =>
            value && setViewMode(value as "grid" | "list")
          }
        >
          <ToggleGroupItem value="grid" aria-label="Vista en cuadrícula">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Vista en lista">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Memos Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {memos.map((memo) => (
          <MemoCard
            key={memo.id}
            memo={memo}
            onClick={() => setSelectedMemo(memo)}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Memo Details Modal */}
      {selectedMemo && (
        <MemoDetails
          memo={selectedMemo}
          isOpen={!!selectedMemo}
          onClose={() => setSelectedMemo(null)}
        />
      )}
    </div>
  );
}
