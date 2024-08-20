import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      colors: {
        slate: {
          "750": "#253248",
        },
      },
      letterSpacing: {
        tightest: "-.075em",
      },
    },
  },
  plugins: [],
} satisfies Config;
