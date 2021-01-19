import axios from "../axios";

/*
 * 机构管理模块
 */

// 保存
export const insert = data => {
  return axios({
    url: "/v1/departments/insert",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/v1/departments/delete/" + data,
    method: "delete"
  });
};
// 修改
export const batchUpdate = data => {
  return axios({
    url: "/v1/departments/update",
    method: "put",
    data
  });
};
// 查询机构树
export const findDeptTree = () => {
  return axios({
    url: "/v1/departments/tree",
    method: "get"
  });
};
