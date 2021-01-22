import axios from "../axios";

/*
 * LED电子屏管理模块
 */

// 新增
export const insert = data => {
  return axios({
    url: "v1/leds/insert",
    method: "post",
    data
  });
};
// 删除
export const deleteById = data => {
  return axios({
    url: "v1/leds/delete/" + data,
    method: "post"
  });
};
// 修改
export const update = data => {
  return axios({
    url: "v1/leds/update",
    method: "post",
    data
  });
};
// 分页查询
export const page = data => {
  return axios({
    url: "v1/leds/page",
    method: "post",
    data
  });
};
// 根据ID查询
export const get = params => {
  return axios({
    url: "v1/leds/get",
    method: "get",
    params
  });
};
