import { coreAPI } from '.'
import { BASE_URL_CLINIC, BASE_URL_HOST, BASE_URL_STATIC } from '@common/constants'

export default {
  createAppointment(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/CreateAppointment`, data)
  },

  editAppointment(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditAppointmentDetails`, data)
  },

  deleteAppointment(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/DeleteAppointment`, data)
  },
}
