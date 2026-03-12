import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsForm } from "@/components/business/settings/SettingsForm";
import { getUserProfile } from "@/app/actions/profileActions";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const result = await getUserProfile();

    if (!result.success || !result.data) {
        redirect("/auth");
    }

    return (
        <div className="relative flex-1 w-full flex flex-col">
            {/* Background Blobs */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md pt-2 pb-6 -mx-6 px-6 -mt-6 rounded-b-xl border-b border-zinc-900 shadow-sm mb-6">
                <PageHeader
                    title="Configurações"
                    subtitle="Gerencie suas preferências visuais, de sistema e metas financeiras."
                    className="mb-0"
                />
            </div>

            <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-0 pb-20">
                <SettingsForm initialData={result.data} />
            </div>
        </div>
    );
}
