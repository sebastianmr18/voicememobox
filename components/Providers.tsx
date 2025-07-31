"use client";

import { SessionProvider } from "next-auth/react";
import { TranscriptionProvider } from "@/context/TranscriptionContext";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TranscriptionProvider>
        <SidebarProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#374151",
              },
            }}
          />
        </SidebarProvider>
      </TranscriptionProvider>
    </SessionProvider>
  );
}
