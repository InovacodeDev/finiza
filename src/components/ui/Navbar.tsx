"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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
        if (window.location.pathname !== "/") {
            window.location.href = "/";
            return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
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
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-24">
                {/* Logo */}
                <button
                    onClick={scrollToTop}
                    className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 hover:text-emerald-400 transition-colors focus:outline-none"
                >
                    Finiza<span className="text-emerald-500">.</span>
                </button>

                {/* Desktop Menu */}
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
                    <button className="rounded-xl bg-emerald-500/10 px-5 py-2.5 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm font-semibold tracking-wide">
                        Acessar o App
                    </button>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-zinc-300 hover:text-zinc-100 transition-colors bg-white/5 rounded-full border border-white/5 backdrop-blur-md focus:outline-none"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
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
                            <button className="w-full rounded-xl bg-emerald-500/10 px-4 py-4 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 font-semibold text-lg">
                                Acessar o App
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
