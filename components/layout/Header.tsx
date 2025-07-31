"use client";

import { Mic, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { toggle } = useSidebar();
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="lg:hidden"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">VoiceMemoBox</h1>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {!session ? (
                <span>Hola usuario</span>
              ) : (
                <span>{session.user?.name}</span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              aria-label="Cerrar sesión"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
