/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'darker-primary': '#212129',
      'primary': '#5E5EFF',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'white': '#ffffff'
    },
    fontFamily: {
      sans: ['Corbel', 'sans-serif'],
    },
    extend: {      
      keyframes:{
        spinReverse: {
          '0%': { 
            transform: 'rotate(360deg)'
          },
          '100%': {
            transform: 'rotate(0deg)'
          }
        }
      }, 
      animation: {
        'spin-slow': 'spin 11s linear infinite',
        'spin-slower-reverse' : 'spinReverse 18s linear infinite'
      },
      transitionProperty: {
        'shadow-transform' : 'shadow, transform'
      }
    }
  },
  plugins: [],
}
