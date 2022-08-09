module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  corePlugins: {
    fontFamily: false,
  },
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
    './utils/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      //bg colors
      colors: {
        'purple': '#9c27b0',
        'light-blue': '#659be0',
        'light-gray': '#E9ECEF',
        'cyan-blue': '#b4d5e8',
        'medium-gray': '#ccc',
        'cyan-light-blue': '#34B0F0'
      },
      minWidth: {
        'auto': 'auto',
        '28': '7.5rem',
        '40': '10rem',
        '44': '14rem',
        '80': '18rem',
        '3/4': '75%',
      },
      fontWeight: {
        medium: 500,
        semibold: 600,
      },
      borderColor: {
        'select': '#ccc'
      },
      textColor: {
        'grey': '#808080',
        'deep-blue': '#222c3c',
      },
      zIndex: {
        '-10': '-10',
      },
      spacing: {
        'nav': '62px'
      },
      boxShadow: {
        'container': '0px 4px 8px rgba(176, 190, 197, 0.3)'
      },
      container: {
        padding: {
          DEFAULT: '0.5rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      fontSize: {
        'tiny': '.875rem',
      }
    },
  },
  // variants: {},
  plugins: [],
  variants: {
    display: ['responsive', 'hover', 'group-hover'],
  },
  important: true,
};
