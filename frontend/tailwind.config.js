/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // Dark mode elegante (Slate 900)
        surface: "#1e293b",    // Elementos de cards (Slate 800)
        border: "#334155",     // Bordas sutis (Slate 700)
      }
    },
  },
  plugins: [],
}