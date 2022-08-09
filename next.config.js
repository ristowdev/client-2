require('dotenv').config()

const withFonts = require('next-fonts')

module.exports = withFonts({
  serverRuntimeConfig: {},
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/login-test': { page: '/login-test' },
      '/password-reset': { page: '/password-reset' },
      '/register': { page: '/register' },
      '/clinic-members': { page: '/clinic-members' },
      '/self-member-details': { page: '/self-member-details' },
      '/self-login-details': { page: '/self-login-details' },
      '/clinic-details': { page: '/clinic-details' },
      '/clinic-settings': { page: '/clinic-settings' },
      '/clinic-plan': { page: '/clinic-plan' },
      '/patients': { page: '/patients' },
      '/appointments': { page: '/appointments' },
      '/patients/details': { page: '/patients/details' },
      '/patients/visits': { page: '/patients/visits' },
      '/patients/appointments': { page: '/patients/appointments' },
      '/visit-details': { page: '/visit-details' },
      '/edit-sheet': { page: '/edit-sheet' },
    }
  },
  env: {
    DEVELOPMENT: process.env.DEVELOPMENT || false
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    PORT: process.env.PORT || 3000,
    PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY,
  },
})
