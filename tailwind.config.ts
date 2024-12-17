import { nextui } from "@nextui-org/theme";
import { type Config } from "tailwindcss";

export default {
  important: true,
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/components/modal.js",
  ],
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
  plugins: [nextui()],
} satisfies Config;
