/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Playfair Display"', 'serif'],
        serif: ['"Playfair Display"', 'serif'],
        display: ['"Cinzel"', 'serif'],
      },
      colors: {
        brand: {
          blue: '#0f172a', // Slate 900 - Dark Navy
          red: '#991b1b',  // Red 800 - Deep Red
          gold: '#d4af37', // Metallic Gold
          light: '#f8fafc', // Slate 50
        }
      }
    },
  },
  plugins: [],
}

