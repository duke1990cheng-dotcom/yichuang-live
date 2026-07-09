import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#30383C",
        gold: "#C9975B",
        blue: "#7D94AA",
        sage: "#84917E",
        line: "#CBD3D7",
        paper: "#F7F7F5"
      },
      fontFamily: {
        sans: [
          "Avenir Next",
          "Helvetica Neue",
          "PingFang SC",
          "Noto Sans SC",
          "Arial",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(48, 56, 60, 0.08)"
      }
    }
  },
  plugins: [typography]
};

export default config;
