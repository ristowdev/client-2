import { coreAPI } from '.'
import { BASE_URL_CLINIC, BASE_URL_HOST, BASE_URL_STATIC } from '@common/constants'

export default {
  addMemberByEmail(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/AddMemberByEmail`, data)
  },

  getRoles() {
    return coreAPI.get(`${BASE_URL_STATIC}/member_roles.json`)
  },

  getTimeFormats() {
    return coreAPI.get(`${BASE_URL_STATIC}/time_formats.json`)
  },

  getTimeZones() {
    return coreAPI.get(`${BASE_URL_HOST}/GetTimeZones`)
  },

  editMemberRole(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditMemberRole`, data)
  },

  leaveClinic(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/LeaveClinic`, data)
  },

  removeMember(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/RemoveMember`, data)
  },

  editClinicPlan(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/EditClinicPlan`, data)
  },

  getClinicMembers(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/GetClinicMembers`, data)
  },

  createClinic(data) {
    return coreAPI.post(`${BASE_URL_CLINIC}/CreateClinic`, data)
  },
}
