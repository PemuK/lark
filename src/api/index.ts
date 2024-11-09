import request from "../utils/request";

// 获取数据的接口
export const fetchData = () => {
  return request({
    url: "./table.json",
    method: "get",
  });
};

// 登录接口
export const loginApi = (username: string, password: string) => {
  return request({
    url: "/account/login",
    method: "post",
    params: {
      username,
      password
    }
  });
};

// 登出接口
export const logoutApi = () => {
  return request({
    url: "/account/logout",
    method: "post",
  });
};

// 修改密码接口
export const changePasswordApi = (userId: number, oldPassword: string, newPassword: string) => {
  return request({
    url: "/account/change-password",
    method: "post",
    params: {
      userId,
      oldPassword,
      newPassword
    }
  });
};
