import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#07070b",
        fg: "#f3f4f6",
        primary: "#8b5cf6",
        secondary: "#22d3ee",
        accent: "#8b5cf6",
        accent2: "#22d3ee"
      },
      fontFamily: {
        display: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-geist)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [typography],
};
export default config;
