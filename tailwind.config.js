/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          light: '#4CAF50',
          dark: '#1B5E20',
        },
        accent: {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
        background: '#F5F5F5',
      },
      fontFamily: {
        arabic: ['Traditional Arabic', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'app': '16px',
      },
    },
  },
  plugins: [],
};
