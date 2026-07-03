import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui compatibility (via CSS variables)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Kinetic Obsidian design tokens
        surface: "#0c1324",
        "surface-bright": "#33394c",
        "surface-container": "#191f31",
        "surface-container-low": "#151b2d",
        "surface-container-lowest": "#070d1f",
        "surface-container-high": "#23293c",
        "surface-container-highest": "#2e3447",
        "on-surface": "#dce1fb",
        "on-surface-variant": "#c7c4d7",
        "slate-muted": "#64748B",
        emerald: "#4edea3",
        gold: "#ffd166",
        "on-primary-dark": "#1000a9",
        "outline-variant": "#464554",
        "border-glass": "rgba(255, 255, 255, 0.1)",
        "indigo-glow": "rgba(99, 102, 241, 0.15)",
      },
      spacing: {
        "section-gap": "8rem",
        gutter: "2rem",
        "margin-mobile": "1rem",
        "stack-gap": "1.5rem",
      },
      maxWidth: {
        "container-max": "1200px",
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
