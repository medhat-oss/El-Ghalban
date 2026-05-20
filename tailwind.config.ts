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
        apple: "0 4px 24px -6px rgba(0, 0, 0, 0.08)",
        "apple-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
        "apple-md": "0 8px 32px -8px rgba(0, 0, 0, 0.08)",
        "apple-lg": "0 16px 48px -12px rgba(0, 0, 0, 0.12)",
        "apple-dark": "0 4px 24px -6px rgba(0, 0, 0, 0.3)",
        card: "0 2px 10px rgba(0,0,0,0.04), 0 10px 30px rgba(14,165,233,0.04)",
        "card-hover": "0 10px 40px -10px rgba(0,0,0,0.08), 0 20px 40px rgba(14,165,233,0.08)",
        nav: "0 4px 24px -6px rgba(0,0,0,0.06)",
        btn: "0 4px 12px -4px rgba(14,165,233,0.4)",
        "btn-hover": "0 8px 20px -6px rgba(14,165,233,0.5)",
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
        "slide-up-fade": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
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
        "slide-in-right":  "slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-right": "slide-out-right 0.3s ease-in",
        "fade-up":         "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up-fade":   "slide-up-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-soft":      "pulse-soft 2.5s ease-in-out infinite",
        shimmer:           "shimmer 2s linear infinite",
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
      // ── Background Gradients ──────────────────────────────
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-soft': 'linear-gradient(to right, #f0f9ff, #e0f2fe)',
        'gradient-dark-soft': 'linear-gradient(to right, #0f172a, #1e293b)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(14,165,233,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [
    // RTL support via Tailwind logical properties is built-in for v3+
    // @tailwindcss/forms available if needed
  ],
};

export default config;
