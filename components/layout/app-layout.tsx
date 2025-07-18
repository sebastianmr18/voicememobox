"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useSidebar } from "@/hooks/use-sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { isOpen } = useSidebar();

    return (
            <div className="min-h-screen bg-gray-50">
<Header />
      <div className="flex">
        <Sidebar />

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-64" : "lg:ml-16"}`}
          role="main"
          aria-label="Contenido principal"
        >
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
    )
}