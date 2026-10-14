const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['index.html', './src/**/*.{html,js,tsx}', './node_modules/preline/preline.js'],
  theme: {
    extend: {
      colors: {
        // Papa Johns palette (approximated; Papa Johns publishes no official hex codes).
        // "orange" is the app's primary brand color, so it maps to Papa Johns "fresh basil" green.
        orange: {
          50: '#EEF6F1',
          100: '#D6EBDF',
          200: '#B0D8C2',
          300: '#7FC09C',
          400: '#4DA678',
          500: '#228B5B',
          600: '#0E7A4A',
          700: '#00693F',
          800: '#005C37',
          900: '#003D25',
        },
        // "tangy tomato" red
        red: {
          500: '#E1262F',
          800: '#A91B22',
        },
        // "pepperoncini" yellow-green and "fluffy dough" off-white tones
        yellow: {
          50: '#FBF9EE',
          100: '#F4F1DC',
          200: '#E3E69B',
          500: '#B5C334',
          700: '#7A8421',
          800: '#5F6819',
        },
      },
      animation: {
        wobble: 'wobble .5s ease-in-out',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('preline/plugin')],
};
