"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, CreditCard } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter } from "next/navigation";
import { ConfirmModal } from "./ConfirmModal";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isAppRoute = pathname !== "/" && pathname !== "/auth";
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        setIsOpen(false);
        if (window.location.pathname !== "/") {
            window.location.href = `/#${id}`;
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100; // offset for the header
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const scrollToTop = () => {
        setIsOpen(false);
        if (isAppRoute && pathname !== "/dashboard") {
            router.push("/dashboard");
            return;
        }
        if (!isAppRoute && pathname !== "/") {
            router.push("/");
            return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className={twMerge(
                    "fixed z-50 top-0 left-0 right-0 w-full transition-all duration-500 ease-out",
                    isScrolled
                        ? "bg-zinc-950/80 border-b border-white/5 backdrop-blur-xl py-4 shadow-lg"
                        : "bg-transparent py-6 md:py-8",
                )}
            >
                <div
                    className={twMerge(
                        "flex items-center justify-between px-6",
                        isAppRoute ? "w-full lg:px-8" : "max-w-7xl mx-auto lg:px-24",
                    )}
                >
                    {/* Logo */}
                    {isAppRoute ? (
                        <div className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 select-none cursor-default">
                            Finiza<span className="text-emerald-500">.</span>
                        </div>
                    ) : (
                        <button
                            onClick={scrollToTop}
                            className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 hover:text-emerald-400 transition-colors focus:outline-none"
                        >
                            Finiza<span className="text-emerald-500">.</span>
                        </button>
                    )}

                    {/* App Menus */}
                    {isAppRoute && (
                        <div className="relative flex items-center" ref={menuRef}>
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none"
                            >
                                <User className="h-5 w-5" />
                            </button>

                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-xl"
                                    >
                                        <div className="flex flex-col py-2">
                                            <button
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false);
                                                    router.push("/account");
                                                }}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-zinc-100 transition-colors focus:outline-none text-left"
                                            >
                                                <User className="h-4 w-4" />
                                                Perfil
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false);
                                                    router.push("/account/plan");
                                                }}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-zinc-100 transition-colors focus:outline-none text-left"
                                            >
                                                <CreditCard className="h-4 w-4" />
                                                Plano
                                            </button>
                                            <div className="my-2 h-px w-full bg-white/10" />
                                            <button
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false);
                                                    setShowLogoutModal(true);
                                                }}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors focus:outline-none text-left font-medium"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sair
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Desktop Menu */}
                    {!isAppRoute && pathname !== "/auth" && (
                        <div className="hidden md:flex items-center gap-8">
                            <button
                                onClick={() => scrollTo("solucao")}
                                className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors focus:outline-none"
                            >
                                Solução
                            </button>
                            <button
                                onClick={() => scrollTo("produto")}
                                className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors focus:outline-none"
                            >
                                Benefícios
                            </button>
                            <button
                                onClick={() => scrollTo("precos")}
                                className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors focus:outline-none"
                            >
                                Planos
                            </button>
                            <div className="w-px h-6 bg-white/10" />
                            <button
                                onClick={() => router.push("/auth")}
                                className="rounded-xl bg-emerald-500/10 px-5 py-2.5 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm font-semibold tracking-wide"
                            >
                                Acessar o App
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle Button */}
                    {!isAppRoute && pathname !== "/auth" && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 text-zinc-300 hover:text-zinc-100 transition-colors bg-white/5 rounded-full border border-white/5 backdrop-blur-md focus:outline-none"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    )}
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden absolute top-full left-0 right-0 bg-zinc-900/95 border-b border-white/10 overflow-hidden backdrop-blur-3xl shadow-2xl"
                        >
                            <div className="flex flex-col items-center gap-6 py-8 px-6">
                                <button
                                    onClick={() => scrollTo("solucao")}
                                    className="text-lg font-medium text-zinc-300 hover:text-zinc-100 transition-colors focus:outline-none"
                                >
                                    Solução
                                </button>
                                <button
                                    onClick={() => scrollTo("produto")}
                                    className="text-lg font-medium text-zinc-300 hover:text-zinc-100 transition-colors focus:outline-none"
                                >
                                    Benefícios
                                </button>
                                <button
                                    onClick={() => scrollTo("precos")}
                                    className="text-lg font-medium text-zinc-300 hover:text-zinc-100 transition-colors focus:outline-none"
                                >
                                    Planos
                                </button>
                                <div className="w-full h-px bg-white/10" />
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push("/auth");
                                    }}
                                    className="w-full rounded-xl bg-emerald-500/10 px-4 py-4 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 font-semibold text-lg"
                                >
                                    Acessar o App
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            <ConfirmModal
                isOpen={showLogoutModal}
                title="Sair da plataforma"
                description="Tem certeza que deseja sair? Você precisará fazer login novamente para acessar sua conta."
                confirmText="Sair"
                cancelText="Cancelar"
                onConfirm={() => {
                    setShowLogoutModal(false);
                    // Aqui pode colocar o signOut do Supabase
                    router.push("/auth");
                }}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
}
