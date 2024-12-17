import request from "../utils/request";

export const listByStatus = (status: number) => {
    return request({
        url: "/group/list",
        method: "get",
        params: {
            status
        }
    });
};