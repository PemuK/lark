function formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };
    return new Date(dateString).toLocaleString("zh-CN", options);
};

function transformDataToCascaderFormat(data: Record<string, Array<any>>) {
    return Object.keys(data).map((year) => ({
        value: year,
        label: year,
        children: data[year].map((item, index) => ({
            value: `${item.id}`,
            label: `${item.name}`,
            // Add more properties from your data as needed
        })),
    }));
}

export {formatDateToISO,formatDate,transformDataToCascaderFormat};