import React from "react";
import { getAccountsAction } from "@/app/actions/account-actions";
import { AccountsClient } from "./accounts-client";

export default async function AccountsPage() {
    const response = await getAccountsAction();
    const data = response.success ? response.data || [] : [];

    // Map DB account to UI account
    const initialAccounts = data.map((account) => ({
        id: account.id,
        name: account.name,
        institution: account.institution || "",
        category: account.category as "checking" | "savings" | "wallet" | "vault" | "credit",
        balance: account.balance,
        colorHex: account.color_hex || "#8A05BE",
        lastSyncedAt: new Date(account.updated_at),
        members: [{ id: "u1", name: "Você", role: "owner" as const }],
    }));

    return <AccountsClient initialAccounts={initialAccounts} />;
}
