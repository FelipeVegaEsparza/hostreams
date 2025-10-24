/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'move-and-rotate': 'move-and-rotate 25s ease-in-out infinite',
      },
      keyframes: {
        'move-and-rotate': {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0) rotate(0deg) scale(1)',
          },
          '25%': {
            transform: 'translateY(-20px) translateX(20px) rotate(45deg) scale(1.1)',
          },
          '50%': {
            transform: 'translateY(0) translateX(-20px) rotate(90deg) scale(1)',
          },
          '75%': {
            transform: 'translateY(20px) translateX(20px) rotate(135deg) scale(1.1)',
          },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.animation-delay-4000': {
          'animation-delay': '4s',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}