/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        amberglass: '#E09C5F',
        copperglow: '#B56B46',
        midnight: '#0E1A24',
      },
      fontFamily: {
        sans: ['\"Plus Jakarta Sans\"', 'system-ui', 'sans-serif'],
        serif: ['\"Playfair Display\"', 'serif'],
      },
      backgroundImage: {
        'liquid-gradient': 'linear-gradient(135deg, rgba(224, 156, 95, 0.8), rgba(181, 107, 70, 0.6), rgba(59, 102, 107, 0.5))',
      },
      boxShadow: {
        glass: '0 25px 50px -12px rgba(224, 156, 95, 0.45)',
      },
    },
  },
  plugins: [],
};
