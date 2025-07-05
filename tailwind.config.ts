import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(215, 100%, 50%)", // Azul brillante
          foreground: "hsl(0, 0%, 100%)", // Blanco
        },
        secondary: {
          DEFAULT: "hsl(280, 70%, 50%)", // Púrpura
          foreground: "hsl(0, 0%, 100%)", // Blanco
        },
        destructive: {
          DEFAULT: "hsl(350, 100%, 50%)", // Rojo
          foreground: "hsl(0, 0%, 100%)", // Blanco
        },
        muted: {
          DEFAULT: "hsl(215, 25%, 20%)", // Azul oscuro apagado
          foreground: "hsl(215, 20%, 80%)", // Gris azulado claro
        },
        accent: {
          DEFAULT: "hsl(150, 90%, 50%)", // Verde brillante
          foreground: "hsl(215, 100%, 20%)", // Azul oscuro
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
