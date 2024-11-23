import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import router from "../router"; // 确保导入的是已创建的 router 实例
import { useUserStore } from "../stores/user"; // 导入用户 store
import { AnyARecord } from "dns";

const service: AxiosInstance = axios.create({
  baseURL: "http://localhost:56000", // API 基础地址
  // baseURL: "http://192.168.106.195:56000", // API 基础地址
  timeout: 5000, // 超时时间
  withCredentials: true, // 允许携带 cookie
});

let isSessionExpired = false; // 用于防止重复跳转

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const userStore = useUserStore();
    if (userStore.token && userStore.id) {
      document.cookie = `token=${userStore.token}; path=/;`;
      document.cookie = `id=${userStore.id}; path=/;`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("请求错误: ", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse | any) => {

    // 检查响应数据中的错误码
    if (response.data.code === 2004||response.data.code === 1008) {
      ElMessage.warning("权限不足");
    }

    if (response.data.code === -100) {
      ElMessage.warning(" 该用户名已存在");
    }

    if (response.data.code === 2000) {
      ElMessage.warning("登陆失败");
    }

    if (response.data.code === 2001 || response.data.code === 2002) {
      if (!isSessionExpired) {
        isSessionExpired = true;
        console.log(isSessionExpired);
        // 清除会话
        const userStore = useUserStore();
        userStore.outLogin(); // 用于处理登出逻辑

        // 跳转到登录页面并传递 `out=true` 参数
        router.push({ path: '/login', query: { out: 'true' } }).catch((error:any) => {
          console.error("跳转到登录页面失败: ", error);
        }).finally(() => {
          isSessionExpired = false; // 确保状态重置
        });

        // 返回一个被解决的 Promise 对象，避免重复弹出错误
        return Promise.resolve({
          data: {
            code: 2001,
            message: '会话已过期，请重新登陆',
          },
        });
      }
    }

    // 正常处理响应
    return response;
  },
  (error: AxiosError) => {
    // 网络错误或其他问题
    console.error("响应错误: ", error);

    // 检查是否有响应数据，区分服务器错误与网络问题
    if (error.response) {
      ElMessage.error(`请求错误，状态码: ${error.response.status}`);
    } else {
      ElMessage.error("请求失败，请检查网络连接");
    }

    return Promise.reject(error);
  }
);
export default service;
