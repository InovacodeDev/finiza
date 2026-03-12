import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/business/profile/ProfileForm";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Perfil | Finiza",
    description: "Gerencie seus dados e convide sua família.",
};

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("full_name, avatar_url, tenant_id")
        .eq("id", user.id)
        .single();

    if (error || !profile) {
        console.error("Error fetching profile:", error);
        // Fallback para dados vazios se o perfil ainda não existir (deve ser criado no onboarding)
    }

    return (
        <ProfileForm 
            initialData={{
                full_name: profile?.full_name || null,
                avatar_url: profile?.avatar_url || null,
            }} 
        />
    );
}
