import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
            <Sidebar />
            {/* Adicionamos pt-32 aqui para compensar o header, 
                e permitimos que o child ocupe todo o restante do lado direito */}
            <div className="flex-1 flex flex-col items-center w-full pt-32 pb-12 px-6 lg:px-8">{children}</div>
        </div>
    );
}
