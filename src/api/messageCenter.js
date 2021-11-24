import request from '@/utils/request'

let url = window.location.hostname;
if (url.indexOf('hdu') > -1) {
    var baseURL = 'http://jsjdj.hdu.edu.cn'
} else {
    var baseURL = 'http://121.196.146.231'
}

export function getnotices(data) {
    return request({
        url: baseURL + '/v1/api/notices/me',
        method: 'get',
        params: data
    })
}

export function getMsgDetail(n_id) {
    return request({
        url: baseURL + '/v1/api/notices/me/' + n_id,
        method: 'get'
    })
}

export function searchUser(op_user_id) {
    return request({
        url: baseURL + '/v1/api/manage-user/' + op_user_id,
        method: 'get'
    })
}

export function passAsk(url) {
    return request({
        url: url,
        method: 'get'
    })
}

export function rejectAsk(url) {
    return request({
        url: url,
        method: 'get'
    })
}