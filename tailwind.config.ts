import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Design System Colors ──────────────────────────────
      colors: {
        sky: {
          50:  "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",   // PRIMARY — buttons, headers
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        silver: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",   // PRIMARY — borders, secondary elements
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        brand: {
          primary:    "#0ea5e9",   // sky-500
          secondary:  "#cbd5e1",   // silver-300
          dark:       "#0369a1",   // sky-700
          light:      "#e0f2fe",   // sky-100
          accent:     "#0284c7",   // sky-600
        },
      },

      // ── Typography ────────────────────────────────────────
      fontFamily: {
        cairo:   ["var(--font-cairo)", "Cairo", "sans-serif"],
        tajawal: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
        sans:    ["var(--font-cairo)", "Cairo", "sans-serif"],
      },

      // ── Custom Shadows ────────────────────────────────────
      boxShadow: {
        card:     "0 1px 3px rgba(0,0,0,.08), 0 8px 24px rgba(14,165,233,.07)",
        "card-hover": "0 4px 12px rgba(0,0,0,.1), 0 16px 40px rgba(14,165,233,.12)",
        nav:      "0 2px 20px rgba(0,0,0,.08)",
        btn:      "0 2px 8px rgba(14,165,233,.35)",
        "btn-hover": "0 4px 16px rgba(14,165,233,.5)",
      },

      // ── Custom Animations ─────────────────────────────────
      keyframes: {
        "slide-in-right": {
          "0%":   { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)",    opacity: "1" },
        },
        "slide-out-right": {
          "0%":   { transform: "translateX(0)",    opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "fade-up": {
          "0%":   { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "slide-in-right":  "slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-out-right": "slide-out-right 0.3s ease-in",
        "fade-up":         "fade-up 0.4s ease-out",
        "pulse-soft":      "pulse-soft 2s ease-in-out infinite",
        shimmer:           "shimmer 1.6s linear infinite",
      },

      // ── Spacing additions ─────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },

      // ── Border radius ─────────────────────────────────────
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      // ── Z-index scale ─────────────────────────────────────
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [
    // RTL support via Tailwind logical properties is built-in for v3+
    // @tailwindcss/forms available if needed
  ],
};

export default config;
