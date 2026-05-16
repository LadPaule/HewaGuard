import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2E98D5",
          green: "#76A92A",
          dark: "#173152",
          white: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
export default config;