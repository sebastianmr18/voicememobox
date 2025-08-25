"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInButton } from "./signInButton";
import { Shield, Zap, Globe } from "lucide-react";

export function LoginCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            ¡Bienvenido de vuelta!
          </CardTitle>
          <CardDescription className="text-gray-600">
            ¿Primera vez aquí?{" "}
            <span className="text-red-600 font-medium">
              El registro es automático con Google
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sign In Button */}
          <SignInButton />

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="bg-red-50 p-2 rounded-lg mx-auto w-fit">
                <Shield className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-xs text-gray-600">Seguro</p>
            </div>
            <div className="space-y-2">
              <div className="bg-red-50 p-2 rounded-lg mx-auto w-fit">
                <Zap className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-xs text-gray-600">Rápido</p>
            </div>
            <div className="space-y-2">
              <div className="bg-red-50 p-2 rounded-lg mx-auto w-fit">
                <Globe className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-xs text-gray-600">Global</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
