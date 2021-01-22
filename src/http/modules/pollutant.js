import axios from "../axios";

/*
 * 污染物管理模块
 */

// 新增
export const insert = data => {
  return axios({
    url: "v1/pollutants/insert",
    method: "post",
    data
  });
};
// 删除
export const deleteById = data => {
  return axios({
    url: "v1/pollutants/delete/" + data,
    method: "post"
  });
};
// 修改
export const update = data => {
  return axios({
    url: "v1/pollutants/update",
    method: "post",
    data
  });
};
// 分页查询
export const page = data => {
  return axios({
    url: "v1/pollutants/page",
    method: "post",
    data
  });
};
// 根据污染物类型查询
export const getByType = params => {
  return axios({
    url: "v1/pollutants/list/type",
    method: "get",
    params
  });
};
// 根据ID查询
export const get = params => {
  return axios({
    url: "v1/pollutants/get",
    method: "get",
    params
  });
};
// 根据排放口ID查询
export const getbyname = params => {
  return axios({
    url: "v1/pollutants/list/name",
    method: "get",
    params
  });
}; // 根据排放口ID查询
export const listByOutfallId = params => {
  return axios({
    url: "v1/pollutants/list/outfallId",
    method: "get",
    params
  });
};
// 查询所有
export const list = () => {
  return axios({
    url: "v1/pollutants/list",
    method: "get"
  });
};
