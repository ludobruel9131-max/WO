/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        savane: {
          bg: "#0b0b0b",
          card: "#151515",
          line: "#2b2b2b",
          accent: "#f59e0b",
          accent2: "#d97706",
          textDim: "#9ca3af"
        }
      },
      boxShadow: {
        soft: "0 10px 20px rgba(0,0,0,.35)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    },
  },
  plugins: [],
};
