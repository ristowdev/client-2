import axios from 'axios'
import { BASE_URL_STATIC } from '@common/constants'

export default {
  getTranslations(lang) {
    return axios.get(`${BASE_URL_STATIC}/translations2/${lang}/all.json`)
  },
  getLanguages() {
    return axios.get(`${BASE_URL_STATIC}/languages.json`)
  },
}
