import type { Config } from "tailwindcss";

export default {
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
        main: "#F3F5F8",
        purple: "#5A57CB",
        dateHeader: "#6A7988",
        dateIndicator: "#728096",
        exerciseItemNumber: "#95A6B7",
        exerciseItemSets: "#919CAD",
      },
      borderColor: {
        border: "rgba(34, 36, 38, 0.15)",
        border2: "#DFDFDF",
      },
      borderRadius: {
        card: "3px",
        workout: "6px",
      },
      boxShadow: {
        card: "0px 0px 4px 0px #0000001A",
      },
      fontSize: {
        ten: "10px",
        eleven: "11px",
      },
      spacing: {
        '1.5': '5px',
      },
    },
  },
  plugins: [],
} satisfies Config;
