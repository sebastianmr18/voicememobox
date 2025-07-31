"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err: any) {
      console.error("Error during Google sign-in:", err);
      setError("Error al iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        variant="outline"
        className="w-full flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Iniciando sesión…</span>
          </>
        ) : (
          <span>Iniciar sesión con Google</span>
        )}
      </Button>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}
