/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0a1628',
        blue: { DEFAULT: '#0d3b8e', mid: '#1655c0' },
        'blue-mid': '#1655c0',
        accent: { DEFAULT: '#f5a623', light: '#ffb940' },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
        body: ['Barlow', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
