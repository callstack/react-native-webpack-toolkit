const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      blue: colors.blue,

      dark: {
        200: 'rgb(16, 17, 17)',
        300: 'rgb(23, 24, 25)',
        400: 'rgb(51, 52, 53)',
      },
      primary: {
        500: 'rgb(0, 239, 210)',
      },
    },
  },
  variants: {
    extend: {
      outline: ['focus'],
      backgroundOpacity: ['hover'],
    },
  },
  plugins: [],
};
