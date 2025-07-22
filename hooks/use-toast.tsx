"use client";

import { toast as sonnerToast } from "sonner";
import type { ReactNode } from "react";

interface ToastProps {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive";
  action?: ReactNode;
}

export function useToast() {
  const toast = ({
    title,
    description,
    variant = "default",
    action,
  }: ToastProps) => {
    const message = title || description;
    const descriptionText = title && description ? description : undefined;

    if (variant === "destructive") {
      return sonnerToast.error(message, {
        description: descriptionText,
        action: action as any,
      });
    }

    return sonnerToast.success(message, {
      description: descriptionText,
      action: action as any,
    });
  };

  const dismiss = (toastId?: string | number) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
    } else {
      sonnerToast.dismiss();
    }
  };

  return {
    toast,
    dismiss,
    toasts: [], // Mantenemos por compatibilidad pero Sonner maneja esto internamente
  };
}
