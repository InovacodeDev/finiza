"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserProfile, type UserProfile } from "@/app/actions/profileActions";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await getUserProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/auth");
    }
  };

  return (
    <header className="relative z-40 flex h-16 shrink-0 items-center justify-end gap-2 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl px-6 transition-all">
      <div className="flex items-center gap-4" ref={menuRef}>
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all focus:outline-none overflow-hidden"
          >
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={profile.full_name || "Perfil"} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5" />
            )}
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
                  <div className="px-4 py-2 border-b border-white/5 mb-1 bg-white/[0.02]">
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-0.5">Usuário</p>
                    <p className="text-sm font-semibold text-zinc-100 truncate">{profile?.full_name || "Carregando..."}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push("/profile");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-zinc-100 transition-colors focus:outline-none text-left"
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push("/settings");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-zinc-100 transition-colors focus:outline-none text-left"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </button>
                  <div className="my-1 h-px w-full bg-white/10" />
                  <button
                    onClick={handleLogout}
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
      </div>
    </header>
  );
}
