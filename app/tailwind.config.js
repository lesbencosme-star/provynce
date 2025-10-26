/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          blue: {
            DEFAULT: '#00D4FF',
            light: '#3DE1FF',
            dark: '#0099CC',
            900: '#005577',
          },
          cyan: '#00D4FF',
          navy: {
            DEFAULT: '#0A1929',
            light: '#1A2F42',
            dark: '#050C14',
          },
          accent: {
            purple: '#7B16FF',
            green: '#00FF88',
          },
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
