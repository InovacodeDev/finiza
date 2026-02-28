import React from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionListGroupProps {
    date: Date | string;
    children: React.ReactNode;
}

export function TransactionListGroup({ date, children }: TransactionListGroupProps) {
    const dateObj = new Date(date);

    // Convert to proper timezone if needed (naive approach for now)
    dateObj.setHours(dateObj.getHours() + dateObj.getTimezoneOffset() / 60);

    let relativeDateStr = "";
    if (isToday(dateObj)) {
        relativeDateStr = "Hoje";
    } else if (isYesterday(dateObj)) {
        relativeDateStr = "Ontem";
    } else {
        relativeDateStr = format(dateObj, "EEEE, d 'de' MMMM", { locale: ptBR });
        // Capitalize first letter
        relativeDateStr = relativeDateStr.charAt(0).toUpperCase() + relativeDateStr.slice(1);
    }

    return (
        <div className="mb-8 last:mb-0">
            <h3 className="text-sm font-semibold text-zinc-500 mb-4 px-4 uppercase tracking-wider">
                {relativeDateStr}
            </h3>
            <div className="flex flex-col gap-1">{children}</div>
        </div>
    );
}
