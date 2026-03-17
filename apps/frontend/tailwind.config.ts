import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#20B2AA",
          hover: "#1a9b94",
        },
        teal: {
          500: "#20B2AA",
          600: "#1a9b94",
        },
        sidebar: {
          dark: "#1a1a1a",
          active: "#20B2AA",
          "active-bg": "rgba(32, 178, 170, 0.15)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
