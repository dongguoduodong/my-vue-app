import request from '@/utils/request'

let url = window.location.hostname;
if (url.indexOf('hdu')>-1) {
  var baseURL = 'http://jsjdj.hdu.edu.cn'
} else {
  var baseURL = 'http://121.196.146.231'
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
        url: baseURL + '/v1/api/manage-user',
        method: 'get',
        params: data
    })
}

export function searchUser_p(url, data) {
    return request({
        url: url,
        method: 'get',
        params: data
    })
}

export function searchFeedback(data) {
    return request({
        url: baseURL + '/v1/api/feedback/me',
        method: 'get',
        params: data
    })
}

export function createNotice(data) {
    return request({
        url: baseURL + '​/v1/api/notices',
        method: 'post',
        data: data
    })
}

export function getFeedbackUser(data) {
    return request({
        url: baseURL + '/v1/api/feedback/' + data.feedback_id + '/users',
        method: 'get',
        params: data
    })
}