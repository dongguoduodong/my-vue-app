import request from '@/utils/request'

let url = window.location.hostname;
if (url.indexOf('hdu') > -1) {
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

export function searchGathering(data) {
    return request({
        url: baseURL + '/v1/api/manage-gatherings/me/create',
        method: 'get',
        params: data
    })
}

export function createGathering(data) {
    return request({
        url: baseURL + '/v1/api/manage-gatherings',
        method: 'post',
        data: data
    })
}

export function searchLeave(data) {
    return request({
        url: baseURL + '/v1/api/manage-gatherings/user',
        method: 'get',
        params: data
    })
}

export function reject(data) {
    return request({
        url: baseURL + '/v1/api/manage-gatherings/' + data.g_id + '/user/' + data.user_id + ':reject_ask_off',
        method: 'get',
        params: data
    })
}

export function pass(data) {
    return request({
        url: baseURL + '/v1/api/manage-gatherings/' + data.g_id + '/user/' + data.user_id + ':pass_ask_off',
        method: 'get',
        params: data
    })
}
export function getFeedback(type, g_id) {
    return request({
        url: baseURL + '​/v1/api/feedback/type/' + type + '/ref_obj/' + g_id,
        method: 'get'
    })
}

export function searchFeedbackUser(g_id, data) {
    return request({
        url: baseURL + '​/v1/api/manage-gatherings/' + g_id + '/user',
        method: 'get',
        params: data
    })
}

export function uploadFile(data) {
    return request({
        url: baseURL + '/v1/api/files',
        method: 'post',
        data: data
    })
}