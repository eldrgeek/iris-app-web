import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f8f5ef",
        "bg-alt": "#f2ede4",
        text: "#1c1a17",
        "text-mid": "#4a4540",
        "text-dim": "#7a746c",
        accent: "#5c4a2a",
        "accent-light": "#8b6e3e",
        rule: "#d8d0c4",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "'Times New Roman'", "serif"],
      },
      maxWidth: {
        content: "680px",
        wide: "900px",
      },
    },
  },
  plugins: [],
};

export default config;
