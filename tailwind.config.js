/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
      colors: {
        cream: '#FDFBF7',
        sand: '#E5E5E5',
        'sand-dark': '#D1D1D1',
        moss: '#557C55',
        'text-dark': '#222222',
        'text-mid': '#555555',
        'text-soft': '#888888',
        sage: {
          DEFAULT: '#A3B899',
          light: '#EAF0E7',
          dark: '#7A916E',
        },
        lavender: {
          light: '#F0E7F5',
          dark: '#8E73A6',
        },
        blush: {
          light: '#FBE8E8',
          dark: '#C97A7E',
        },
        sky: {
          light: '#E6F0F9',
          dark: '#5B8FB9',
        },
      }
    }
  },
  plugins: []
};