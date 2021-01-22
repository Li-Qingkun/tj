import axios from "../axios";

/*
 * 字典管理模块
 */

// 保存
export const save = data => {
  return axios({
    url: "/dict/save",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/dict/delete",
    method: "post",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "v1/dictionaries/page",
    method: "post",
    data
  });
};

// 根据类型查询
export const listByType = params => {
  return axios({
    url: "v1/dictionaries/list/type",
    method: "get",
    params
  });
};

// 根据类型查询树
export const listTreeByType = params => {
  return axios({
    url: "v1/dictionaries/list/tree/type",
    method: "get",
    params
  });
};
