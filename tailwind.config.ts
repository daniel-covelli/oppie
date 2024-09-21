import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

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
  plugins: [
    // eslint-disable-next-line @typescript-eslint/unbound-method
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".dialog": {
          "@apply w-fit rounded-lg border border-slate-600 bg-slate-750": {},
        },
      });
    }),
  ],
} satisfies Config;
