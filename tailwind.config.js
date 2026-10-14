const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['index.html', './src/**/*.{html,js,tsx}', './node_modules/preline/preline.js'],
  theme: {
    extend: {
      colors: {
        // Papa Johns palette, sampled from papajohns.com computed styles.
        // "orange" is the app's primary accent, so it maps to the Papa Johns brand green.
        orange: {
          50: '#EEF4ED',
          100: '#D9E7D7',
          200: '#F5E8DC', // cream
          300: '#9DBE99',
          400: '#5E9559',
          500: '#3F7A3B',
          600: '#346E4A',
          700: '#2D5D2A',
          800: '#2D5D2A', // Papa Johns green
          900: '#1F421D',
        },
        red: {
          500: '#E60000', // Papa Johns red
          800: '#AB131B',
        },
        // blue-grey slate becomes cream / off-white / green
        slate: {
          50: '#F9F9F9',
          100: '#F5E8DC',
          200: '#F5E8DC',
          300: '#D1D1D1',
          400: '#2D5D2A',
          500: '#626462',
          600: '#F9F9F9', // page background
          700: '#3C3C3C',
          800: '#171717',
          900: '#121412',
        },
        gray: {
          50: '#F9F9F9',
          100: '#F2F2F2',
          200: '#E6E6E6',
          300: '#D1D1D1',
          400: '#9A9C9A',
          500: '#626462',
          600: '#4A4C4A',
          700: '#3C3C3C',
          800: '#171717',
          900: '#121412',
        },
        neutral: {
          50: '#F9F9F9',
          100: '#F2F2F2',
          200: '#E6E6E6',
          300: '#D1D1D1',
          400: '#9A9C9A',
          500: '#626462',
          600: '#4A4C4A',
          700: '#3C3C3C',
          800: '#171717',
          900: '#171717',
        },
        blue: {
          500: '#2D5D2A',
          600: '#2D5D2A',
          700: '#1F421D',
        },
        yellow: {
          50: '#FBF9EE',
          100: '#F4F1DC',
          200: '#D7F31D', // Papa Johns lime
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
