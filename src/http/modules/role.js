import { data } from "autoprefixer";
import axios from "../axios";

/*
 * 角色管理模块
 */

// 保存
export const save = data => {
  return axios({
    url: "/v1/roles/insert",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/v1/roles/delete/" + data,
    method: "delete"
  });
};
// 修改
export const batchUpdate = data => {
  return axios({
    url: "/v1/roles/update",
    method: "put",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "v1/roles/page",
    method: "post",
    data
  });
};
//根据ID查询
export const findById = data => {
  return axios({
    url: "/v1/roles/get/" + data,
    method: "get"
  });
};

// 查询全部
export const findAll = () => {
  return axios({
    url: "/role/findAll",
    method: "get"
  });
};
// 查询角色菜单集合
export const findRoleMenus = params => {
  return axios({
    url: "/role/findRoleMenus",
    method: "get",
    params
  });
};
// 保存角色菜单集合
export const saveRoleMenus = data => {
  return axios({
    url: "/role/saveRoleMenus",
    method: "post",
    data
  });
};
