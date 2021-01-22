import axios from "../axios";

/*
 * 用户管理模块
 */

// 保存
export const save = data => {
  return axios({
    url: "/v1/users/insert",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/v1/users/delete/" + data,
    method: "delete"
  });
};
//修改
export const batchUpdate = data => {
  return axios({
    url: "/v1/users/update",
    method: "put",
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
// // 导出Excel用户信息
// export const exportUserExcelFile = data => {
//   return axios({
//     url: "/user/exportUserExcelFile",
//     method: "post",
//     data
//   });
// };

// // 根据用户名查找
// export const getByUserName = params => {
//   return axios({
//     url: "v1/users/get/username",
//     method: "get",
//     params
//   });
// };
// 根据ID查找
export const getById = params => {
  return axios({
    url: "v1/users/get/" + params,
    method: "get"
  });
};
// 根据用户名查找
export const checkUserName = params => {
  return axios({
    url: "v1/users/check/username/" + params,
    method: "get"
  });
};
// // 更新用户密码
// export const updatePassword = params => {
//   return axios({
//     url: "/user/updatePassword",
//     method: "get",
//     params
//   });
// };
