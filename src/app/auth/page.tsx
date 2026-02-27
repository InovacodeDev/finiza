import { OtpForm } from "@/components/auth/OtpForm";

export const metadata = {
    title: "Entrar | Finiza",
    description: "Acesse sua conta do Finiza via código seguro.",
};

export default function AuthPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
            {/* Background igual ao da tela de Privacidade */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(16,185,129,0.12),transparent)] pointer-events-none" />

            <div className="relative z-10 w-full flex justify-center">
                <OtpForm />
            </div>
        </div>
    );
}
