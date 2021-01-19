/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

// 后台管理系统服务器地址
//export const baseUrl = 'http://localhost:8080'
export const baseUrl = "http://49.234.210.194:8021/rbac-service";
// export const baseUrl = 'http://122.114.192.136:8080/ground-service'

// 系统数据备份还原服务器地址
// export const backupBaseUrl = 'http://139.196.87.48:8002'
export const backupBaseUrl = "http://localhost:8002";

export default {
  baseUrl,
  backupBaseUrl
};
