/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Roboto','sans-serif']
      },
      gridTemplateColumns:{
        '70/30': '70% 28%'
      },
      colors: {
        primary: 'indigo-700', // Example primary color
        secondary: 'indigo-600', // Example secondary color
      },
      borderRadius: {
        'lg': '0.5rem',
      },
      padding: {
        '2': '0.5rem',
      },
    },
  },
  plugins: [],
}