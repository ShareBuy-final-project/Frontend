import { indigo } from '@mui/material/colors';

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
        indigo700: '#303F9F',
        indigo600: '#3949AB',
        indigo200: '#9FA8DA',
        indigo500: '#3F51B5',
        indigo400: '#5C6BC0',
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