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
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["Sora", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        corridor: {
          bg: "#f8f9fd",
          primary: "#1c2033",
          navy: "#1a1d2d",
          mid: "#434968",
          muted: "#7c829e",
          accent: "#7c84b8",
          glow: "rgba(216, 212, 255, 0.45)",
          ring: "rgba(130, 140, 220, 0.16)",
        }
      }
    },
  },
  plugins: [],
};
export default config;
