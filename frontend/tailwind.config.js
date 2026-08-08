/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#080D18",
          soft: "#0B1220",
        },
        panel: {
          DEFAULT: "#121B2E",
          light: "#182338",
          border: "#233047",
        },
        teal: {
          DEFAULT: "#2FA89D",
          bright: "#3FC7B8",
          dim: "#1F7A72",
        },
        gold: {
          DEFAULT: "#C9A24B",
          bright: "#E4C06E",
          dim: "#8F7233",
        },
        ivory: "#EDEFF4",
        slate: {
          soft: "#8B97AC",
          dim: "#5C6982",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "genesis-glow":
          "radial-gradient(60% 60% at 20% 0%, rgba(47,168,157,0.16) 0%, rgba(8,13,24,0) 60%), radial-gradient(50% 50% at 100% 20%, rgba(201,162,75,0.12) 0%, rgba(8,13,24,0) 60%)",
        "quill-line":
          "linear-gradient(90deg, transparent, #2FA89D 15%, #C9A24B 85%, transparent)",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 40px -20px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(47,168,157,0.25), 0 0 24px rgba(47,168,157,0.15)",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.45 },
        },
        rise: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: 400 },
          "100%": { strokeDashoffset: 0 },
        },
      },
      animation: {
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        rise: "rise 0.6s ease-out both",
        "draw-line": "drawLine 1.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
