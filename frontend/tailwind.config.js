const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-sora)', ...fontFamily.sans],
        sans: ['var(--font-source-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
