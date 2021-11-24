import request from '@/utils/request'

let url = window.location.hostname;
if (url.indexOf('hdu')>-1) {
  var baseURL = 'http://jsjdj.hdu.edu.cn'
} else {
  var baseURL = 'http://121.196.146.231'
}

export function searchUser(data) {
    return request({
        url: baseURL + '/v1/api/manage-steps/step-1',
        method: 'get',
        params: data
    })
}
export function getInfo(data) {
    return request({
        url: baseURL + '/v1/api/manage-user/' + data.op_user_id,
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

export function getFrom(data) {
    return request({
        url: baseURL + '/v1/api/form/' + data.form_id + ':watch',
        method: 'get',
        params: data
    })
}
