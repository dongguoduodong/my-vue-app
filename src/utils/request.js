import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  // transformRequest: [function (data) {
  //   return Qs.stringify(data)
  // }],
  baseURL: '',
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = getToken()
      //config.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    if (config.method === 'get') {
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.success === false) {
      const msg = res.fields ? res.fields : res.detail
      Message({ type: 'error', message: msg })
      return false
    } else {
      return res
    }
  },
  error => {
    // Message({ type: 'error', message: '服务器开小差啦，请联系工作人员。' })
    console.log(error)
  }
)

export default service
