import axios from "../axios";

/*
 * 企业管理模块
 */

// 新增
export const insert = data => {
  return axios({
    url: "v1/companies/insert",
    method: "post",
    data
  });
};
// 删除
export const deleteById = data => {
  return axios({
    url: "v1/companies/delete/" + data,
    method: "post"
  });
};
// 修改
export const update = data => {
  return axios({
    url: "v1/companies/update",
    method: "post",
    data
  });
};
// 分页查询
export const page = data => {
  return axios({
    url: "v1/companies/page",
    method: "post",
    data
  });
};
// 根据ID查询
export const get = params => {
  return axios({
    url: "v1/companies/get",
    method: "get",
    params
  });
};
// 查询企业ID和名称
export const listIdName = () => {
  return axios({
    url: "v1/companies/list/idName",
    method: "get"
  });
};
// 根据条件查询
export const listPage = data => {
  return axios({
    url: "v1/companies/list/page",
    method: "post",
    data
  });
};
