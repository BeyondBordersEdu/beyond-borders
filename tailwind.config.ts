import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        fg: "hsl(var(--fg))",
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))",
        muted: "hsl(var(--muted))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))"
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(0, 188, 212, 0.35)"
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
