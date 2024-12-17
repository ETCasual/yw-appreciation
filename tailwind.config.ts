import { type Config } from "tailwindcss";

export default {
  important: true,
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        en: ["en", "sans-serif"],
        chi: ["chi", "sans-serif"],
      },
      screens: {
        "3xl": "1800px",
      },
    },
  },
  plugins: [],
} satisfies Config;
