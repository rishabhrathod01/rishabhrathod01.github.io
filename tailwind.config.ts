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
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        // Monochrome ink tokens (see globals.css). Legacy names kept as
        // aliases so existing pages follow the theme.
        surface: "rgb(var(--bg) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--bg) / <alpha-value>)",
        "surface-container-low": "rgb(var(--bg-2) / <alpha-value>)",
        "surface-container": "rgb(var(--bg-2) / <alpha-value>)",
        "surface-container-high": "rgb(var(--bg-3) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--bg-3) / <alpha-value>)",
        "surface-bright": "rgb(var(--bg-3) / <alpha-value>)",
        "on-surface": "rgb(var(--fg) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--fg-2) / <alpha-value>)",
        "slate-muted": "rgb(var(--fg-2) / <alpha-value>)",
        "fg-3": "rgb(var(--fg-3) / <alpha-value>)",
        emerald: "rgb(var(--fg) / <alpha-value>)",
        gold: "rgb(var(--fg) / <alpha-value>)",
        "on-primary-dark": "rgb(var(--bg) / <alpha-value>)",
        "outline-variant": "rgb(var(--line) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "border-glass": "rgb(var(--line) / <alpha-value>)",
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
        sans: ["var(--font-manrope)", "sans-serif"],
        geist: ["var(--font-manrope)", "sans-serif"],
        jetbrains: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.22, 1, 0.36, 1)",
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
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
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
