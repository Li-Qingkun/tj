import axios from "../axios";

/*
 * 操作日志模块
 */

// 删除
export const batchDelete = data => {
  return axios({
    url: "/loginlog/delete",
    method: "post",
    data
  });
};
