"use client";

import "@/app/globals.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";

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
  const router = useRouter();

  if (status === "loading") {
    return <div className="p-6 text-center">Cargando sesión...</div>;
  }

  return <AppLayout>{children}</AppLayout>;
}
