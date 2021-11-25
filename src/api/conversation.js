import request from '@/utils/request'

let url = window.location.hostname;
if (url.indexOf('hdu') > -1) {
    var baseURL = 'http://jsjdj.hdu.edu.cn'
} else {
    var baseURL = 'http://101.34.237.153:7000'
}

export function getUsers(data) {
    return request({
        url: baseURL + '/v1/api/talk/users',
        method: 'get',
        params: data
    })
}

export function getTalkers(data) {
    return request({
        url: baseURL + '/v1/api/talk/talkers',
        method: 'get',
        params: data
    })
}

export function searchTalk(data) {
    return request({
        url: baseURL + '/v1/api/talk/me',
        method: 'get',
        params: data
    })
}

export function createTalk(data) {
    return request({
        url: baseURL + '/v1/api/talk',
        method: 'post',
        data: data
    })
}

export function deleteTalk(talk_id) {
    return request({
        url: baseURL + '/v1/api/talk/' + talk_id,
        method: 'delete'
    })
}

export function getForm(form_id) {
    return request({
        url: baseURL + '/v1/api/form/' + form_id + ':watch',
        method: 'get'
    })
}

export function searchUser(data) {
    return request({
        url: baseURL + '/v1/api/manage-steps/step-1',
        method: 'get',
        params: data
    })
}

export function getStep(data) {
    return request({
        url: baseURL + '/v1/api/manage-steps/' + data.step_id + '/evidences',
        method: 'get',
        params: data
    })
}

export function saveForm(data) {
    return request({
        url: baseURL + '/v1/api/talk/talk-record-when-join-form',
        method: 'post',
        data: data
    })
}

export function commitForm(form_id) {
    return request({
        url: baseURL + '/v1/api/form/' + form_id + ':commit',
        method: 'get'
    })
}