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
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="fixed z-50 transition-all duration-500 ease-out top-6 right-6 sm:top-8 sm:right-8"
        >
            <div className="flex flex-col items-end relative">
                <div
                    className={twMerge(
                        "flex flex-col items-center gap-6 rounded-[2rem] px-4 py-8 shadow-2xl backdrop-blur-2xl transition-all duration-500 ease-out overflow-hidden",
                        isScrolled
                            ? "border border-white/10 bg-zinc-900/40"
                            : "border border-transparent bg-transparent shadow-none",
                    )}
                >
                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-col items-center gap-6 text-sm font-medium text-zinc-300">
                        <a href="#produto" className="hover:text-zinc-100 transition-colors">
                            Produto
                        </a>
                        <a href="#manifesto" className="hover:text-zinc-100 transition-colors">
                            Manifesto
                        </a>
                        <a href="#precos" className="hover:text-zinc-100 transition-colors">
                            Preços
                        </a>
                        <div className="w-10 h-px bg-white/10 my-2" />
                        <button
                            className="rounded-xl bg-emerald-500/10 px-4 py-3 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 hover:shadow-lg hover:shadow-emerald-500/10 text-xs font-semibold uppercase tracking-wider"
                            title="Acessar o App"
                        >
                            Acessar
                        </button>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-3 text-zinc-300 hover:text-zinc-100 transition-colors bg-white/5 rounded-full border border-white/5 backdrop-blur-md"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-end gap-2 rounded-2xl border border-white/10 bg-zinc-900/50 p-4 shadow-2xl backdrop-blur-3xl min-w-[200px] absolute right-0 top-full mt-4 origin-top-right md:hidden"
                        >
                            <a
                                href="#produto"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-right py-2 text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                            >
                                Produto
                            </a>
                            <a
                                href="#manifesto"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-right py-2 text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                            >
                                Manifesto
                            </a>
                            <a
                                href="#precos"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-right py-2 text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                            >
                                Preços
                            </a>
                            <div className="w-full h-px bg-white/10 my-2" />
                            <button className="w-full rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 text-center">
                                Acessar o App
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
