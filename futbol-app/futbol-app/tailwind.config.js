/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cancha: {
          verde: "#1D9E75",
          verdeoscuro: "#085041",
          amarillo: "#F5C518",
          gris: "#F4F6F8",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(8,80,65,0.08)",
      },
    },
  },
  plugins: [],
};
