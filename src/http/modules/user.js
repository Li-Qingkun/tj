import axios from "../axios";

/*
 * 用户管理模块
 */

// 保存
export const save = data => {
  return axios({
    url: "/user/save",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/user/delete",
    method: "post",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "/v1/users/page",
    method: "post",
    data
  });
};
// 导出Excel用户信息
export const exportUserExcelFile = data => {
  return axios({
    url: "/user/exportUserExcelFile",
    method: "post",
    data
  });
};

// 根据用户名查找
export const getByUserName = params => {
  return axios({
    url: "v1/users/get/username",
    method: "get",
    params
  });
};
// 更新用户密码
export const updatePassword = params => {
  return axios({
    url: "/user/updatePassword",
    method: "get",
    params
  });
};
