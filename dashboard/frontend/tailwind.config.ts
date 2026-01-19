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
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#EB4425",
                "background-light": "#F0F4F8",
                "background-dark": "#0f172a",
                "panel-light": "#FFFFFF",
                "panel-dark": "rgba(30, 41, 59, 0.4)",
                "text-light": "#4a5568",
                "text-dark": "#f8fafc",
                "accent-blue": "#6789BE",
                "neon-blue": "#00f0ff",
                "neon-green": "#39ff14",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            }
        },
    },
    plugins: [],
};
export default config;
