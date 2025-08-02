"use client";

import { useState, useEffect } from "react";
import { MemoCard } from "@/components/memo/memo-card";
import { MemoDetails } from "@/components/memo/memo-details";
import { EmptyState } from "@/components/states/empty-state";
import { FileText, Grid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSession } from "next-auth/react";
import { hashEmail } from "@/lib/hash";
import { Button } from "@/components/ui/button";
import { se } from "date-fns/locale";

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

export function HistoryList() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: session } = useSession();

  useEffect(() => {
    const getTrancrisptsByUser = async () => {
      const email = session?.user?.email ?? "anonymous";
      const userId = await hashEmail(email);
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
    };

    if (session?.user?.email) {
      getTrancrisptsByUser();
    }
  }, [session?.user?.email]);

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
