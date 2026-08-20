import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { ink: "#1A1A1A", muted: "#676767", line: "#E8E5DF", canvas: "#F7F9FC", cream: "#FAF8F5", gold: "#C9A227", danger: "#E53838" },
      fontFamily: { sans: ["var(--font-jakarta)", "sans-serif"], inter: ["var(--font-inter)", "sans-serif"], display: ["var(--font-cormorant)", "serif"] },
    },
  },
  plugins: [],
};

export default config;
