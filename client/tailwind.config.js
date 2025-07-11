/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#18181b",
        secondary: "#27272a",
        accent: "#6366f1",
        error: "#ef4444",
        success: "#22c55e",
        text: "#f4f4f5",
      },
    },
  },
  darkMode: "class",
  plugins: [],
} 