import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // for first button
        defaultColor: "var(--defaultColor)",
        hoverColor:"var(--hoverColor)",
        pressedColor:"var(--pressedColor)",
        disableColor:"var(--disableColor)",
        // for second button
        defaultColor2: "var(--defaultColor2)",
        hoverColor2:"var(--hoverColor2)",
        pressedColor2:"var(--pressedColor2)",
        disableColor2:"var(--disableColor2)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
