export type MaintRecord = {
    clientId?:any;
    clientName: string;
    phoneNumber: string;
    unit?: string; // 可选字段，默认值为空字符串
    room: string;
    buildingId: number;
    adderId: number;
    maintDescription: string;
    locationDescription: string;
};
