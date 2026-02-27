"use server";

import { Resend } from "resend";
import { AccountInviteEmail } from "@/components/emails/AccountInviteEmail";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

export async function sendAccountInvite(data: {
    email: string;
    inviterName: string;
    accountName: string;
    role: string;
}) {
    try {
        const baseUrl =
            process.env.NODE_ENV === "development" ? "http://localhost:9991" : "https://finiza.inovacode.dev";
        const inviteLink = `${baseUrl}/invite?email=${encodeURIComponent(data.email)}&role=${encodeURIComponent(data.role)}&account=${encodeURIComponent(data.accountName)}`;

        const { data: resendData, error } = await resend.emails.send({
            from: "Finiza <finiza@inovacode.dev>", // Replace with your verified domain
            to: [data.email],
            subject: `Convite para participar da conta: ${data.accountName}`,
            react: AccountInviteEmail({
                inviterName: data.inviterName,
                accountName: data.accountName,
                inviteLink,
            }) as React.ReactElement,
        });

        if (error) {
            console.error(error);
            return { success: false, error: error.message };
        }

        return { success: true, data: resendData };
    } catch (err: unknown) {
        console.error(err);
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}
