import Axios from 'axios'
import getConfig from 'next/config'
import useSWR from 'swr'

const { publicRuntimeConfig } = getConfig()
const baseUrl = publicRuntimeConfig.API_URL || "https://bioclinic.azurewebsites.net"

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

export function useRequest(request, { initialData, ...config } = {}) {
  API.setToken(config)
  return useSWR(
    request ? (typeof request === 'string' ? request : JSON.stringify(request)) : null,
    () => coreAPI(request || {}).then((response) => response.data),
    {
      ...config,
      initialData: initialData && {
        status: 200,
        statusText: 'InitialData',
        headers: {},
        data: initialData,
      },
    },
  )
}

class API {
  static async setToken(config) {
    if (config.token) {
      coreAPI.defaults.headers.common.Authorization = `Bearer ${config.token}`
    }
  }
}