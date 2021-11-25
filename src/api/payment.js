import request from '@/utils/request'

let url = window.location.hostname;
if (url.indexOf('hdu')>-1) {
  var baseURL = 'http://jsjdj.hdu.edu.cn'
} else {
  var baseURL = 'http://101.34.237.153:7000'
}

export function organizations(data) {
    return request({
        url: baseURL + '/v1/api/organizations',
        method: 'get',
        params: data
    })
}

export function searchUser(data) {
    return request({
        url: baseURL + '/v1/api/manage-payment',
        method: 'get',
        params: data
    })
}
