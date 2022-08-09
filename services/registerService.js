import { coreAPI } from '.'
import { BASE_URL_CLINIC, BASE_URL_HOST } from '@common/constants'

export default {
  login(data) {
    return coreAPI.post(`${BASE_URL_HOST}/LoginTest`, data)
  },

  login2(data) {
    return coreAPI.post(`${BASE_URL_HOST}/login`, data)
  },

  async getTimeZone(data) {
    return coreAPI.post(`${BASE_URL_HOST}/IanaToWinTimeZone`, data)
  },

  async register(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/register`, data)
  },

  async onRequestVerificationCode(data) {
    return coreAPI.post(`${BASE_URL_HOST}/SendVerificationEmail`, data)
  },

  async onChangePassword(data) {
    return coreAPI.post(`${BASE_URL_HOST}/ResetPassword`, data)
  }
}
