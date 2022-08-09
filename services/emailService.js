import { coreAPI } from '.'

export default {
  generalNewsletter(email) {
    return coreAPI.put(`/api/newsletter/general`, { email })
  },
}
