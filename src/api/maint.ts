import {MaintRecord} from '../types/maintRecord';
import request from "../utils/request";

export const addMaintRecordApi = (maintRecord: MaintRecord) => {
    return request({
        url: "/maint-records/add",
        method: "post",
        params: {
            clientId: maintRecord.clientId,
            clientName: maintRecord.clientName,
            phoneNumber: maintRecord.phoneNumber,
            unit: maintRecord.unit, // 可选字段，可能为 undefined
            room: maintRecord.room,
            buildingId: maintRecord.buildingId,
            adderId: maintRecord.adderId,
            maintDescription: maintRecord.maintDescription,
            locationDescription: maintRecord.locationDescription
        }
    });
};

export const getFinishWhListApi = (pageNum: number, pageSize: number, state: number) => {
    return request({
        url: "/maint-records/finished-list",
        method: "get",
        params: {
            pageNum,
            pageSize,
            state
        }
    });
};

export const getUnFinishWhListApi = (state: number) => {
    return request({
        url: "/maint-records/unfinished-list",
        method: "get",
        params: {
            state
        }
    });
};

export const listMaintTypeByStatusApi = (status: number) => {
    return request({
        url: "/maint-types/list",
        method: "get",
        params: {
            status
        }
    });
};


export const updateMaintTypeApi = (id: number, typeName?: string, workAmount?: number, status?: number) => {
    return request({
        url: "/maint-types/update",
        method: "post",
        params: {
            id,
            typeName,
            workAmount,
            status
        }
    });
};

export const addMaintTypeApi = (typeName: string, workAmount: number) => {
    return request({
        url: "/maint-types/add",
        method: "post",
        params: {
            typeName,
            workAmount
        }
    });
};

export const updateMaintTypeStatusApi = (id: number, status: number) => {
    return request({
        url: "/maint-types/update-status",
        method: "post",
        params: {
            id,
            status
        }
    });
};

export const updateMaintStateApi = (maintRecordId: any, state: any) => {
    return request({
        url: "/maint-records/del",
        method: "post",
        params: {
            maintRecordId,
            state
        }
    });
};


export const updateMaintRecordApi = (
    userId: number,
    maintRecordId: number,
    clientId: number,
    clientName: string,
    phoneNumber: string,
    buildingId: number,
    unit: string,
    room: string,
    maintDescription: string,
    locationDescription: string,
    players?: string,           // Optional parameter
    maintType?: number,         // Optional parameter
    note?: string,              // Optional parameter
    status?: number             // Optional parameter
) => {
    return request({
        url: "/maint-records/modify",
        method: "post",
        params: {
            userId,
            maintRecordId,
            clientId,
            clientName,
            phoneNumber,
            buildingId,
            unit,
            room,
            maintDescription,
            locationDescription,
            players,                // Include the optional parameters
            maintType,
            note,
            status
        }
    });
};


export const reportMaintApi = (
    maintRecordId: number,
    reporterId: number,
    players: string,
    maintType: number,
    note: string,
) => {
    return request({
        url: "/maint-records/report",
        method: "post",
        params: {
            maintRecordId,
            reporterId,
            players,
            maintType,
            note
        }
    });
};

export const listMaintByClientNameApi = (clientName: string, state?: number) => {
    return request({
        url: "/maint-records/client",
        method: "get",
        params: {
            clientName,
            state,
        },
    });
};

export const listMaintByLocationApi = (buildingId: number, unit: string, room: string, state?: number) => {
    return request({
        url: "/maint-records/location",
        method: "get",
        params: {
            buildingId,
            unit,
            room,
            state,
        },
    });
};

export const listMaintByPhoneNumberApi = (phoneNumber: string, state?: number) => {
    return request({
        url: "/maint-records/phone-number",
        method: "get",
        params: {
            phoneNumber,
            state,
        },
    });
}

export const getMaintsByUserIdApi = (userId: number, state?: number) => {
    return request({
        url: "/maint-records/get",
        method: "get",
        params: {
            userId,
            state,
        },
    });
}

export const pageMaintsByUserIdApi = (userId: number, pageNum: number, pageSize: number, state?: number) => {
    return request({
        url: "/maint-records/page/user",
        method: "get",
        params: {
            userId,
            pageNum,
            pageSize,
            state
        },
    });
}


export const listByBuildingUnitRoomApi = (pageNum: number, pageSize: number, searchTerm: string, state?: number) => {
    return request({
        url: "/maint-records/page/location",
        method: "get",
        params: {
            pageNum,
            pageSize,
            searchTerm,
            state,
        },
    });
};

export const listByClientNameApi = (pageNum: number, pageSize: number, clientName: string, state?: number) => {
    return request({
        url: "/maint-records/page/client",
        method: "get",
        params: {
            pageNum,
            pageSize,
            clientName,
            state,
        },
    });
};

export const listByPhoneNumberApi = (pageNum: number, pageSize: number, phoneNumber: string, state?: number) => {
    return request({
        url: "/maint-records/page/phone",
        method: "get",
        params: {
            pageNum,
            pageSize,
            phoneNumber,
            state,
        },
    });
};
export const listByMaintTypeApi = (pageNum: number, pageSize: number, typeId: number, state?: number) => {
    return request({
        url: "/maint-records/page/type",
        method: "get",
        params: {
            pageNum,
            pageSize,
            typeId,
            state,
        },
    });
};
export const listByDescriptionApi = (pageNum: number, pageSize: number, question: string, state?: number) => {
    return request({
        url: "/maint-records/page/question",
        method: "get",
        params: {
            pageNum,
            pageSize,
            question,
            state,
        },
    });
};

export const pageMaintByUserIdsAndTimeApi = (pageNum: number, pageSize: number, startTime: string, endTime: string, userId: number, state?: number) => {
    return request({
        url: "/maint-records/page/persons-time",
        method: "get",
        params: {
            pageNum,
            pageSize,
            startTime,
            endTime,
            userId,
            state,
        }
    })
};

export const listMaintByUserIdsAndMonthApi = (time: string, userId: number, state?: number) => {
    return request({
        url: "/maint-records/persons-month",
        method: "get",
        params: {
            time,
            userId,
            state,
        }
    })
};

export const listMaintByUserIdsAndTimeApi = (startTime: string, endTime: string, userId: number, state?: number) => {
    return request({
        url: "/maint-records/persons-time",
        method: "get",
        params: {
            startTime,
            endTime,
            userId,
            state,
        }
    })
};


