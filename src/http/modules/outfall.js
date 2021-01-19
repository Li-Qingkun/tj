import axios from '../axios'

/* 
 * 排污口管理模块
 */

// 新增
export const insert = (data) => {
    return axios({
        url: 'v1/outfalls/insert',
        method: 'post',
        data
    })
}
// 删除
export const deleteById = (data) => {
    return axios({
        url: 'v1/outfalls/delete/' + data,
        method: 'post'
    })
}
// 修改
export const update = (data) => {
    return axios({
        url: 'v1/outfalls/update',
        method: 'post',
        data
    })
}
// 分页查询
export const page = (data) => {
    return axios({
        url: 'v1/outfalls/page',
        method: 'post',
        data
    })
}
// 根据ID查询
export const get = (params) => {
    return axios({
        url: 'v1/outfalls/get',
        method: 'get',
        params
    })
}
// 根据排放口ID查询排放口-污染物关系
export const getbyid = (params) => {
    return axios({
        url: 'v1/outfalls/list/outfallId',
        method: 'get',
        params
    })
}
// 根据企业ID查询
export const listByCompanyId = (params) => {
    return axios({
        url: 'v1/outfalls/list/companyId',
        method: 'get',
        params
    })
}
// 根据企业ID查询排污口最大排序
export const getMaxSort = (params) => {
    return axios({
        url: 'v1/outfalls/get/maxSort',
        method: 'get',
        params
    })
}
