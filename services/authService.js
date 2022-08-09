import { coreAPI } from '.'
import { BASE_URL_CLINIC, BASE_URL_HOST } from '@common/constants'

export default {
  uploadImage(data) {
    return coreAPI.post(`${BASE_URL_HOST}/UploadProfileImage`, data)
  },

  editSelfMemberDetails(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditSelfMemberDetails`, data)
  },

  editSelfLoginDetails(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditSelfLoginDetails`, data)
  },

  editClinicSettings(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditClinicSettings`, data)
  },

  editClinicDetails(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditClinicDetails`, data)
  },
}
