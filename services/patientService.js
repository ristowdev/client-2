import { coreAPI } from '.'
import { BASE_URL_CLINIC, BASE_URL_STATIC } from '@common/constants'

export default {
  getSortingOptions() {
    return coreAPI.get(`${BASE_URL_STATIC}/patients_sorting_options.json`)
  },

  createPatient(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/CreatePatient`, data)
  },

  editPatientDetails(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditPatientDetails`, data)
  },

  editPatientContact(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditPatientContactDetails`, data)
  },

  deletePatient(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/DeletePatient`, data)
  },
}
