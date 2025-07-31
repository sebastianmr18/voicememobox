import { SignInButton } from "@/components/auth/signInButton";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Bienvenido a VoiceMemoBox</h1>
      <SignInButton />
    </main>
  );
}
