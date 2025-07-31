import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoiceMemoBox - Público",
  description: "Accede a tu cuenta o regístrate",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
