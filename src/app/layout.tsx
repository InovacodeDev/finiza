import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { InstallPrompt } from "@/components/ui/InstallPrompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Finiza",
    description: "SaaS de finanças pessoais focado em previsibilidade de fluxo de caixa.",
    applicationName: "Finiza",
    appleWebApp: {
        capable: true,
        title: "Finiza",
        statusBarStyle: "black-translucent",
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: "#09090b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark scroll-smooth">
            <body
                className={twMerge(
                    clsx(
                        inter.className,
                        "min-h-screen bg-zinc-950 text-zinc-50 antialiased selection:bg-emerald-500/30",
                        "bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]",
                    ),
                )}
            >
                <Navbar />
                <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden backdrop-blur-3xl">
                    {children}
                </main>
                <InstallPrompt />
            </body>
        </html>
    );
}
