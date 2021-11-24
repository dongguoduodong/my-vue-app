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

export function getUserInfo(op_user_id) {
    return request({
        url: baseURL + '/v1/api/manage-user/' + op_user_id,
        method: 'get'
    })
}

export function resetPsw(data) {
    return request({
        url: baseURL + '/v1/api/manage-user/reset-password',
        method: 'post',
        data: data
    })
}

export function getUserStep(user_id) {
    return request({
        url: baseURL + '/v1/api/manage-steps/users/' + user_id,
        method: 'get'
    })
}

export function getEvidence(step_id) {
    return request({
        url: baseURL + '/v1/api/manage-steps/' + step_id + '/evidences',
        method: 'get'
    })
}

export function signPass(sign_id, reason) {
    return request({
        url: baseURL + '/v1/api/manage-steps/signs/' + sign_id + ':pass',
        method: 'post',
        params: reason
    })
}

export function signReject(sign_id, reason) {
    return request({
        url: baseURL + '/v1/api/manage-steps/signs/' + sign_id + ':reject',
        method: 'post',
        params: reason
    })
}

export function uploadFile(step_id, file_name) {
    return request({
        url: baseURL + '/v1/api/manage-steps/' + step_id + '/evidence/file/' + file_name,
        method: 'post'
    })
}

export function uploadDescription(step_id, data) {
    return request({
        url: baseURL + '/v1/api/manage-steps/' + step_id + '/evidence/description',
        method: 'post',
        data: data
    })
}

export function editInfo(op_user_id, data) {
    return request({
        url: baseURL + '/v1/api/manage-user/' + op_user_id,
        method: 'put',
        data: data
    })
}


export function getGroupValue(data) {
    return request({
        url: baseURL + '/v1/api/user_groups/search',
        method: 'get',
        params: data
    })
}

export function getGroupData(data) {
    return request({
        url: baseURL + '/v1/api/user_groups',
        method: 'get',
        params: data
    })
}


export function addGroup(user_group_id, data) {
    return request({
        url: baseURL + '/v1/api/user_groups/' + user_group_id + '/users:add',
        method: 'post',
        data: data
    })
}

export function removeGroup(user_group_id, data) {
    return request({
        url: baseURL + '/v1/api/user_groups/' + user_group_id + '/users:delete',
        method: 'post',
        data: data
    })
}

export function exportExcel() {
    var requestForm = document.createElement('form')
    var requestFrame = document.createElement('iframe')
    document.body.appendChild(requestForm)
    document.body.appendChild(requestFrame)
    requestFrame.id = 'rfFrame'
    requestFrame.name = 'rfFrame'
    requestFrame.style = 'display:none;'
    requestForm.action = baseURL + '/v1/api/manage-user/batch-import-user/example'
    requestForm.target = 'rfFrame'
    requestForm.submit()
}

export function uploadExcel1(data) {
    return request({
        url: baseURL + '/v1/api/files',
        method: 'post',
        data: data
    })
}

export function uploadExcel2(data) {
    return request({
        url: baseURL + '/v1/api/manage-user/batch-import-user/student',
        method: 'post',
        data: data
    })
}

export function getPositionID (data) {
    return request({
        url: baseURL + '/v1/api/user_groups',
        method: 'get',
        data: data
    })
}
