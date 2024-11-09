import request from "../utils/request";

export const addUserApi = (
    name: string,
    username: string,
    password: string,
    level: number,
    phoneNumber: string,
    organizationId: number,
    status: number
) => {
    return request({
        url: "users/add",
        method: "post",
        params: {
            name,
            username,
            password,
            level,
            phoneNumber,
            organizationId,
            status
        }
    });
};

export const listUserByStatusAndStateApi = (status: number, state?: number) => {
    return request({
        url: "/users/list-status",
        method: "get",
        params: {
            status,
            state
        }
    })
}

export const listUserByStateLApi = (state: number) => {
    return request({
        url: "/users/list-state",
        method: "get",
        params: {
            state
        }
    });
};

export const getAllUserApi = (pageNum: number, pageSize: number, state?: number) => {
    return request({
        url: "/users/all",
        method: "get",
        params: {
            pageNum,
            pageSize,
            state
        }
    });
};

export const updateUserInfoApi = (id: number, name: string, username: string, password: string, phoneNumber: string, level: number, organizationId: number, status: number) => {
    return request({
        url: "/users/update",
        method: "post",
        params: {
            id,
            name,
            username,
            password,
            phoneNumber,
            level,
            organizationId,
            status
        }
    });
};

export const updateUserStateByIdApi = (userId: number, state: number) => {
    return request({
        url: "/users/modify-state",
        method: "post",
        params: {
            userId,
            state
        }
    });
};

export const getAllStartYearApi = () => {
    return request({
        url: "/users/start-year",
        method: "get",
    });
};

export const listUserByYearApi = () => {
    return request({
        url: "/users/list-years",
        method: "get",
    });
};

export const listUserByNameApi = (pageNum: number, pageSize: number, name: string, state: number) => {
    return request({
        url: "/users/name",
        method: "get",
        params: {
            pageNum, pageSize, name, state
        }
    });
};

