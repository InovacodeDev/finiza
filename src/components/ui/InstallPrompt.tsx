"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FinizaIcon } from "./FinizaIcon";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsIOS(
                /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: boolean }).MSStream,
            );
            setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
        }, 0);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            if (!sessionStorage.getItem("installPromptShown")) {
                setShowPrompt(true);
                sessionStorage.setItem("installPromptShown", "true");
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    useEffect(() => {
        if (isIOS && !isStandalone) {
            if (!sessionStorage.getItem("installPromptShown")) {
                const timer = setTimeout(() => {
                    setShowPrompt(true);
                    sessionStorage.setItem("installPromptShown", "true");
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [isIOS, isStandalone]);

    if (isStandalone) {
        return null; // Don't show if already installed
    }

    if (!showPrompt) {
        return null;
    }

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setDeferredPrompt(null);
                setShowPrompt(false);
            }
        }
    };

    const handleClose = () => {
        setShowPrompt(false);
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] md:bottom-8 md:left-auto md:right-8 md:w-96 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 text-sm shadow-2xl backdrop-blur-md">
                <button
                    onClick={handleClose}
                    className="absolute right-2 top-2 rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-950 shadow-md border border-white/5 overflow-hidden">
                    <FinizaIcon className="h-full w-full rounded-none border-none text-xl bg-transparent mt-0.5 ml-0.5" />
                </div>
                <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-zinc-100 text-base">Instalar Finiza</h3>
                    <p className="text-zinc-400 mt-1 leading-snug">
                        {isIOS
                            ? "Para instalar, toque em Compartilhar e depois em 'Adicionar à Tela de Início'."
                            : "Instale nosso app para uma experiência mais rápida e offline."}
                    </p>
                </div>
                {!isIOS && (
                    <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                        <button
                            onClick={handleInstallClick}
                            className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/40 active:scale-95"
                        >
                            Instalar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
