import request from "../utils/request";

export const listOrganizationByStatusApi = (pageNum: number, pageSize: number, status?: number) => {
    return request({
        url: "/organizations/page",
        method: "get",
        params: {
            pageNum,
            pageSize,
            status
        },
    });
};

export const pageByNameApi = (pageNum: number, pageSize: number,name:string, status?: number) => {
    return request({
        url: "/organizations/name",
        method: "get",
        params: {
            pageNum,
            pageSize,
            name,
            status
        },
    });
};

export const getOrganizationByStatusApi = ( status?: number) => {
    return request({
        url: "/organizations/list",
        method: "get",
        params: {
            status
        },
    });
};

// 添加组织的API接口
export const addOrganizationApi = (organizationName: string) => {
    return request({
        url: "/organizations/add",
        method: "post",
        params: {
            organizationName
        },
    });
};

// 更新组织名称的API接口
export const updateOrganizationNameApi = (id: number, organizationName: string) => {
    return request({
        url: "/organizations/update-name",
        method: "post",
        params: {
            id,
            organizationName
        },
    });
};

// 更新组织状态的API接口
export const updateOrganizationStatusApi = (id: number, status?: number) => {
    return request({
        url: "/organizations/update-status",
        method: "post",
        params: {
            id,
            status
        },
    });
};

// 根据ID和状态获取组织的API接口
export const getOrganizationByIdAndStatusApi = (id: number, status: number) => {
    return request({
        url: "/organizations/get",
        method: "get",
        params: {
            id,
            status
        },
    });
};
