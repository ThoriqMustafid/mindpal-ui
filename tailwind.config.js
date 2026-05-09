/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: { light: '#e0e7ff', DEFAULT: '#6366f1', dark: '#4f46e5' },
        blush: { light: '#f1f5f9', DEFAULT: '#cbd5e1', dark: '#64748b' },
        cream: '#f8fafc',
        'warm-white': '#ffffff',
        sand: { DEFAULT: '#e2e8f0', dark: '#94a3b8' },
        moss: '#4f46e5',
        text: { dark: '#0f172a', mid: '#334155', soft: '#64748b' },
        lavender: { light: '#eef2ff', DEFAULT: '#c7d2fe', dark: '#6366f1' },
        sky: { light: '#f1f5f9', DEFAULT: '#cbd5e1', dark: '#475569' },
        amber: { light: '#eef2ff', DEFAULT: '#a5b4fc', dark: '#4338ca' },
      },
      fontFamily: {
        lora: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
