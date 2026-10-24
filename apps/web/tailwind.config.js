/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#EBE3D7',
          300: '#DDD2C1',
          400: '#CBBBA3',
          DEFAULT: '#F7F4EE',
        },
        forest: {
          50: '#F0F6F2',
          100: '#D9E9DE',
          200: '#B5D3BD',
          300: '#8AB897',
          400: '#5F996F',
          500: '#3D7A4F',
          600: '#2A5C39',
          700: '#1B4228',
          800: '#143823', // Primary Khmer Forest Green
          900: '#0C2416',
          DEFAULT: '#143823',
        },
        gold: {
          50: '#FAF7F0',
          100: '#F3ECD9',
          200: '#E5D6AF',
          300: '#D5BF82',
          400: '#C8A97E', // Muted Champagne Gold
          500: '#BA9255',
          DEFAULT: '#C8A97E',
        },
        charcoal: {
          50: '#F6F7F7',
          100: '#E2E5E4',
          200: '#C3CAC7',
          300: '#9DA8A4',
          400: '#697772',
          500: '#46534E',
          600: '#333F3A',
          700: '#242D2A',
          800: '#19211E',
          900: '#121715',
          DEFAULT: '#19211E',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        khmer: ['Kantumruy Pro', 'Battambang', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
