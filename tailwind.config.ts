import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial pastel palette anchored on soft sage green.
        sage: {
          50: "#f2f6f1",
          100: "#e2ecdf",
          200: "#c6d9c0",
          300: "#a3c199",
          400: "#7fa374",
          500: "#5f8555",
          600: "#496a41",
          700: "#3a5535",
          800: "#2f442c",
          900: "#263826",
        },
        cream: {
          50: "#fbf9f4",
          100: "#f6f1e6",
          200: "#ede4cf",
          300: "#e0d1b1",
          400: "#cdb589",
          500: "#b89666",
        },
        terracotta: {
          300: "#e3b09a",
          400: "#d69374",
          500: "#c47758",
        },
        ink: {
          DEFAULT: "#2a2a26",
          soft: "#4a4a44",
          muted: "#7a7a72",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      transitionTimingFunction: {
        "liminal": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
