import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    isOpen,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const shouldReduceMotion = useReducedMotion();

    const modalVariants: Variants = {
      hidden: { 
        opacity: 0, 
        scale: shouldReduceMotion ? 1 : 0.95, 
        y: shouldReduceMotion ? 0 : 20 
      },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", duration: 0.3, bounce: 0 } 
      },
      exit: { 
        opacity: 0, 
        scale: shouldReduceMotion ? 1 : 0.95, 
        y: shouldReduceMotion ? 0 : 20, 
        transition: { duration: 0.2 } 
      }
    };

    const backdropVariants: Variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ willChange: "opacity" }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ willChange: "transform, opacity" }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-3xl"
                    >
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                            <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
                            <button
                                onClick={onCancel}
                                className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-100 transition-colors focus:outline-none"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-6">
                            <p className="text-zinc-300">{description}</p>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-white/5 px-6 py-4 bg-zinc-950/50">
                            <button
                                onClick={onCancel}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:bg-white/5 border border-transparent transition-all focus:outline-none"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all focus:outline-none"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
