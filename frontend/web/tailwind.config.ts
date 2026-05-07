import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#0F4FF0",
          600: "#0A35A8",
          900: "#1E3A8A",
        },
        accent: {
          500: "#F5A623",
          100: "#FEF3DC",
        },
        electric: "#00D4FF",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 4px rgba(0,0,0,0.06)",
        lift: "0 8px 24px rgba(15,79,240,0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;

