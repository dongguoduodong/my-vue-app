import request from '@/utils/request'

let url = window.location.hostname;
if (url.indexOf('hdu')>-1) {
  var baseURL = 'http://jsjdj.hdu.edu.cn'
} else {
  var baseURL = 'http://121.196.146.231'
}

export function login(data) {
  return request({
    url: baseURL + '/v1/api/users/login',
    method: 'post',
    data
  })
}


export function getInfo() {
  return request({
    url: baseURL + '/v1/api/users/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: baseURL + '/vue-admin-template/user/logout',
    method: 'post'
  })
}
