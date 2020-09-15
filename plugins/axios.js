import Cookies from 'js-cookie'

export default function ({ $axios, $config }) {
  $axios.defaults.baseURL = $config.API_URL
  $axios.defaults.xsrfCookieName = 'CSRF-TOKEN'
  $axios.defaults.xsrfHeaderName = 'X-CSRF-Token'
  $axios.defaults.withCredentials = true

  if (!Cookies.get('CSRF-TOKEN')) $axios.get('/')

  $axios.onError(error => {
    if (error.response.status === 401) {
      // logout
    } else throw error
  })
}
