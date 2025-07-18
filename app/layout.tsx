import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoiceMemoBox - Transcripción de Notas de Voz",
  description: "Sube tus notas de voz y obtén transcripciones automáticas con AWS Transcribe",
  keywords: ["transcripción", "notas de voz", "audio", "productividad"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
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
      </body>
    </html>
  );
}
