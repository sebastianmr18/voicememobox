"use client";

import "@/app/globals.css";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState } from "@/components/states/loadingState";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return (
      <Suspense fallback={<LoadingState message="Cargando..." />}></Suspense>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
