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
          // 600/700 are AA-safe for small text on the light cream palette
          // (terracotta-500 only reaches ~3.2:1). Used for form errors, etc.
          600: "#a85a3c",
          700: "#8a4529",
        },
        ink: {
          DEFAULT: "#2a2a26",
          // `muted` is measured against the composited background (the aurora
          // tints cream down to ~#dbe4d3), not the flat cream token — at
          // #6b6b63 it only reached 4.1:1. This clears AA at ~5.1:1.
          soft: "#4a4a44",
          muted: "#5c5c54",
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
