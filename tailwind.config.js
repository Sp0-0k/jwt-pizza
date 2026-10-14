const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['index.html', './src/**/*.{html,js,tsx}', './node_modules/preline/preline.js'],
  theme: {
    extend: {
      colors: {
        // Papa Johns palette (approximated; Papa Johns publishes no official hex codes).
        // "orange" is the app's primary accent/CTA color, so it maps to Papa Johns "tangy tomato" red.
        orange: {
          50: '#FDECEC',
          100: '#FAD3D4',
          200: '#F5ABAD',
          300: '#EE7A7E',
          400: '#E8545A',
          500: '#E1262F',
          600: '#D52B1E',
          700: '#B71C22',
          800: '#C8102E',
          900: '#7F0F1C',
        },
        red: {
          500: '#E1262F',
          800: '#A91B22',
        },
        // "fresh basil" greens replace the blue-grey slate surfaces
        slate: {
          50: '#F7F5EC',
          100: '#F1EEDF', // "fluffy dough" off-white
          200: '#E4E0CB',
          300: '#C9D6CD',
          400: '#2F8F68',
          500: '#0B7A4F',
          600: '#006C45', // page background
          700: '#005A3A',
          800: '#00432B',
          900: '#002E1D',
        },
        // neutral greys swap blue tint for warm greys; dark ends become deep basil green
        gray: {
          50: '#F8F7F2',
          100: '#F1EFE6',
          200: '#E2DFD3',
          300: '#CFCCBF',
          400: '#B4B9AF',
          500: '#6F7A72',
          600: '#4B5750',
          700: '#00432B',
          800: '#003B26', // header / app background
          900: '#002A1B',
        },
        // remaining blue accents (focus rings, links, carousel dots) become basil green
        blue: {
          500: '#0B7A4F',
          600: '#006C45',
          700: '#00593A',
        },
        // "pepperoncini" yellow-green
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
