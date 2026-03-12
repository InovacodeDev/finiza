import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/Header";
import { TransitionProvider } from "@/components/ui/TransitionProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-zinc-950 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col overflow-y-auto focus:outline-none w-full pb-12 px-6">
          <div className="w-full max-w-full flex-1 flex flex-col pt-6">
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
