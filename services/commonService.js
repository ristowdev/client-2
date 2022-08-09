import { coreAPI } from '.'
import { BASE_URL_CLINIC, BASE_URL_HOST } from '@common/constants'

export default {
  getClinicOverview(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/GetClinicOverview`, data)
  },

  getClinics(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/GetMyClinics`, data)
  }
}
