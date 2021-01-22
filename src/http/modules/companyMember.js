import axios from "../axios";

/*
 * 企业会员管理模块
 */

// 新增
export const insert = data => {
  return axios({
    url: "v1/company/members/insert",
    method: "post",
    data
  });
};
// 删除
export const deleteById = data => {
  return axios({
    url: "v1/company/members/delete/" + data,
    method: "post"
  });
};
// 修改
export const update = data => {
  return axios({
    url: "v1/company/members/update",
    method: "post",
    data
  });
};
// 分页查询
export const page = data => {
  return axios({
    url: "v1/company/members/page",
    method: "post",
    data
  });
};
// 根据ID查询
export const get = params => {
  return axios({
    url: "v1/company/members/get",
    method: "get",
    params
  });
};
