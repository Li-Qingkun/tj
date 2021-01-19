import axios from "axios";
import config from "./config";
import Cookies from "js-cookie";
import router from "@/router";
import { Message } from "element-ui";

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    });
    // request 请求拦截器
    instance.interceptors.request.use(
      config => {
        let token = Cookies.get("token");
        // 发送请求时携带token
        if (token) {
          config.headers.token = token;
        } else {
          // 重定向到登录页面
          sessionStorage.removeItem("username");
          router.push("/login");
        }
        return config;
      },
      error => {
        // 请求发生错误时
        console.log("request:", error);
        // 判断请求超时
        if (
          error.code === "ECONNABORTED" &&
          error.message.indexOf("timeout") !== -1
        ) {
          console.log("timeout请求超时");
        }
        // 需要重定向到错误页面
        const errorInfo = error.response;
        console.log(errorInfo);
        if (errorInfo) {
          error = errorInfo.data; // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          });
        }
        return Promise.reject(error); // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    );

    // response 响应拦截器
    instance.interceptors.response.use(
      response => {
        return response.data;
      },
      err => {
        if (err && err.response) {
          err.message = err.response.data.message;
          switch (err.response.status) {
            case 500:
              err.message = "服务器错误，请联系管理员！";
              break;
            case 403:
              err.message = "会话超时，请重新登录";
              sessionStorage.removeItem("username");
              router.push("/login");
              break;
            default:
          }
        }
        console.error(err);
        Message({
          message: err.message,
          type: "error",
          duration: 10000,
          showClose: true
        });
        return Promise.reject(err); // 返回接口返回的错误信息
      }
    );
    // 请求处理
    instance(options)
      .then(res => {
        resolve(res);
        return false;
      })
      .catch(error => {
        reject(error);
      });
  });
}
