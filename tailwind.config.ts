import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        violet: {
          DEFAULT: "hsl(var(--violet))",
          foreground: "hsl(var(--violet-foreground))"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "Outfit", "var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(47, 93, 255, 0.22)",
        orange: "0 18px 60px rgba(255, 93, 58, 0.22)",
        violet: "0 18px 60px rgba(139, 92, 246, 0.2)"
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(47, 93, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(47, 93, 255, 0.08) 1px, transparent 1px)",
        aurora: "linear-gradient(90deg, #2F5DFF, #8B5CF6, #FF5D3A)"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(280%)" }
        }
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        scan: "scan 4s linear infinite"
      }
    }
  },
  plugins: [animate]
};

export default config;
