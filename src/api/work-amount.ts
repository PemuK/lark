import request from "../utils/request";
export const getWorkAmountByStartYearApi = (startYears: string, state: number) => {
    return request({
        url: "/work-amount/level",
        method: "get",
        params: {
            startYears,
            state
        }
    });
};

export const getWorkAmountByTimeApi = (startTime: string, endTime: string, state: number) => {
    return request({
        url: "/work-amount/time",
        method: "get",
        params: {
            startTime,
            endTime,
            state
        }
    });
};



export const getTotalWorkAmountApi = (state?: number) => {
    return request({
        url: "/work-amount/total",
        method: "get",
        params: {
            state
        }
    });
};

export const getWeekAmountApi = (time: string) => {
    return request({
        url: "/work-amount/week",
        method: "get",
        params: {
            time
        }
    });
};

export const getMonthAmountApi = (time: string) => {
    return request({
        url: "/work-amount/month",
        method: "get",
        params: {
            time
        }
    });
};

export const listWorkAmountByMonthApi = (time: string) => {
    return request({
        url: "/work-amount/month-list",
        method: "get",
        params: {
            time
        }
    });
};

export const listWorkAmountByUserIdsApi = (userIds: string, state?: number) => {
    return request({
        url: "/work-amount/persons",
        method: "get",
        params: {
            userIds,
            state,
        }
    })
};

