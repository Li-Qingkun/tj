import axios from "../axios";

/*
 * 平台地址管理模块
 */

// 新增
export const insert = data => {
  return axios({
    url: "v1/platform-addresses/insert",
    method: "post",
    data
  });
};
// 删除
export const deleteById = data => {
  return axios({
    url: "v1/platform-addresses/delete/" + data,
    method: "post"
  });
};
// 修改
export const update = data => {
  return axios({
    url: "v1/platform-addresses/update",
    method: "post",
    data
  });
};
// 分页查询
export const page = data => {
  return axios({
    url: "v1/platform-addresses/page",
    method: "post",
    data
  });
};
// 根据ID查询
export const get = params => {
  return axios({
    url: "v1/platform-addresses/get",
    method: "get",
    params
  });
};
