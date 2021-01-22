import axios from "../axios";

/*
 * 字典管理模块
 */

// 根据ID查询
export const get = params => {
  return axios({
    url: "v1/early-warning/get",
    method: "get",
    params
  });
};
// 保存
export const update = data => {
  return axios({
    url: "v1/early-warning/update",
    method: "post",
    data
  });
};
// 删除
export const insert = data => {
  return axios({
    url: "v1/early-warning/insert",
    method: "post",
    data
  });
};
// 分页查询
export const page = data => {
  return axios({
    url: "v1/early-warning/page",
    method: "post",
    data
  });
};

// // 根据类型查询
// export const listByType = (params) => {
//     return axios({
//         url: 'v1/dictionaries/list/type',
//         method: 'get',
//         params
//     })
// }

// // 根据类型查询树
// export const listTreeByType = (params) => {
//     return axios({
//         url: 'v1/dictionaries/list/tree/type',
//         method: 'get',
//         params
//     })
// }
