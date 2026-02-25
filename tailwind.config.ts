// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                glass: {
                    bg: "hsl(var(--glass-bg) / <alpha-value>)",
                    border: "hsl(var(--glass-border) / <alpha-value>)",
                },
                brand: {
                    primary: "hsl(var(--brand-primary))",
                    secondary: "hsl(var(--brand-secondary))",
                    foreground: "hsl(var(--brand-foreground))",
                },
                semantic: {
                    safe: "hsl(var(--safe))",
                    warning: "hsl(var(--warning))",
                    danger: "hsl(var(--danger))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            boxShadow: {
                glass: "var(--glass-shadow)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
};
export default config;
