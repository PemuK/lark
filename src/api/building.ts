import request from "../utils/request";

export const pageByStatusApi = (pageNum: number, pageSize: number, status: number) => {
    return request({
        url: "/building/page",
        method: "get",
        params: {
            pageNum,
            pageSize,
            status
        }
    });
};

export const pageByNameApi = (pageNum: number, pageSize: number, name: string, status: number) => {
    return request({
        url: "/building/name",
        method: "get",
        params: {
            pageNum,
            pageSize,
            name,
            status
        }
    });
};

export const getBuildingListApi = (status: number) => {
    return request({
        url: "/building/list",
        method: "get",
        params: {
            status
        }
    });
};

export const updateBuildingApi = (buildingId: number, buildingName: string, type: number, campus: number) => {
    return request({
        url: "/building/update",
        method: "post",
        params: {
            buildingId,
            buildingName,
            type,
            campus
        }
    });
};

export const updateBuildingStatusApi = (id: number, status: number) => {
    return request({
        url: "/building/updateStatus",
        method: "post",
        params: {
            id,
            status
        }
    });
};

export const addBuildingApi = (buildingName: string, type: number, campus: number, status?: number) => {
    return request({
        url: "/building/add",
        method: "post",
        params: {
            buildingName,
            type,
            campus,
            status
        }
    });
};