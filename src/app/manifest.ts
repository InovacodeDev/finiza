import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Finiza",
        short_name: "Finiza",
        description: "SaaS de finanças pessoais focado em previsibilidade de fluxo de caixa.",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b", // Zinc 950 color
        theme_color: "#09090b",
        icons: [
            {
                src: "/icon-192x192.svg",
                sizes: "192x192",
                type: "image/svg+xml",
            },
            {
                src: "/icon-512x512.svg",
                sizes: "512x512",
                type: "image/svg+xml",
            },
        ],
    };
}
