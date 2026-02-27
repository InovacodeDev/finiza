import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen w-full pt-24 pb-12">
            {/* O navbar global de root/layout já deve estar fixo.
                Este layout adiciona padding top p compensar o header fixo 
                e providenciar um wrapper específico caso precise adicionar menus laterais no futuro. */}
            <main className="flex-1 flex flex-col items-center w-full">{children}</main>
        </div>
    );
}
