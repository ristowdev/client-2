import getConfig from 'next/config'
import EmailService from './emailService'
import RegisterService from './registerService'
import TranslationService from './translationService'
import CommonService from './commonService'
import ClinicService from './clinicService'
import AuthService from './authService'
import PatientService from './patientService'
import VisitService from './visitService'
import Axios from 'axios'

const { publicRuntimeConfig } = getConfig()
const baseUrl = publicRuntimeConfig.API_URL

export const coreAPI = Axios.create({
  baseURL: baseUrl,
  timeout: 30000, // 30s,
  // withCredentials: true,
})

coreAPI.interceptors.request.use(
  function (config) {
    if (config.method !== 'get') {
      // console.log(`${config.method} - ${config.url}`)
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

coreAPI.interceptors.response.use(
  function (response) {
    return response?.data
  },
  function (error) {
    const message = error.response.data.ErrorCode
    throw new Error(message)
  },
)

export const emailService = EmailService
export const registerService = RegisterService
export const translationService = TranslationService
export const commonService = CommonService
export const clinicService = ClinicService
export const authService = AuthService
export const patientService = PatientService
export const visitService = VisitService
