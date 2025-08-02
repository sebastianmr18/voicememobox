"use client";

import Link from "next/link";
import {
  Home,
  Mic,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigationItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Mic, label: "Nueva Nota", href: "/transcribir" },
  { icon: History, label: "Historial", href: "/historial" },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50",
          isOpen ? "w-64" : "w-16",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        aria-label="Navegación principal"
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <div className="hidden lg:flex justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={isOpen ? "Contraer sidebar" : "Expandir sidebar"}
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      !isOpen && "justify-center px-2",
                    )}
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
