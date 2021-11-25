import request from '@/utils/request'

let url = window.location.hostname;
if (url.indexOf('hdu')>-1) {
  var baseURL = 'http://jsjdj.hdu.edu.cn'
} else {
  var baseURL = 'http://101.34.237.153:7000'
}

export function searchPublicity(data) {
  return request({
      url: baseURL + '/v1/api/manage-publicity',
      method: 'get',
      params: data
  })
}

export function deletePublicity(data) {
  return request({
    url: baseURL + '/v1/api/manage-publicity/'+ data.id,
    method: 'delete',
    param: data
  })
}
export function checkPublicity(p_id) {
  return request({
    url: baseURL + '/v1/api/manage-publicity/'+ p_id,
    method: 'get'
  })
}


export function mergePublicity(data) {
  return request({
    url: baseURL + '/v1/api/manage-publicity/merge',
    method: 'post',
    data: data
  })
}
 
export function rejectPublicity(p_id, data) {
  return request({
    url: baseURL + '/v1/api/manage-publicity/'+ p_id + ':reject',
    method: 'post',
    data: data
  })
}
export function makePublicity(data){
  return request({
    url: baseURL + '/v1/api/manage-publicity',
    method: 'post',
    data: data
  })
}

export function submitPublicity(p_id, data) {
  return request({
    url: baseURL + '/v1/api/manage-publicity/'+ p_id + ':submit',
    method: 'post',
    data: data,
    headers:
      {
        'Content-Type': 'application/json'
      }
  })
}


export function notifyPublicity(p_id, data) {
  return request({
    url: baseURL + '/v1/api/manage-publicity/'+ p_id + ':pass',
    method: 'post',
    params: data
  })
}


export function searchPublicityApprover (url, data) {
  return request({
    url: baseURL + url,
    method: 'get',
    params: data
  })
}


export function modifyPublicity(p_id, data) {
  return request({
    url: baseURL + '/v1/api/manage-publicity/'+ p_id,
    method: 'put',
    data: data
  })
}
export function getOrganizationDetails(id){
  return request({
      url: baseURL + '/v1/api/organizations/'+id,
      method: 'get'      
  })
}