import { defineStore } from "pinia"; // 从 Pinia 库中导入定义商店的方法
import { ref } from "vue"; // 从 Vue 库中导入 ref 函数，用于创建响应式数据

// 定义一个接口 ObjectList，用于描述对象的结构
interface ObjectList {
    [key: string]: string[]; // 对象的键是字符串，值是字符串数组
}

// 使用 defineStore 定义一个 Pinia 存储库，名称为 "permiss"
export const usePermissStore = defineStore("permiss", () => {
    // 从 localStorage 中获取名为 "ms_keys" 的数据
    const keys = localStorage.getItem("ms_keys");

    // 创建一个响应式引用 key，初始化值为从 localStorage 中获取的解析数据，如果 localStorage 中没有数据则初始化为空数组
    const key = ref(keys ? JSON.parse(keys) : <string[]>[]);

    // 创建一个响应式引用 defaultList，存储默认的权限列表
    const defaultList = ref<ObjectList>({
        admin: [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
            "11", "12", "13", "14", "15", "16", // 管理员的权限列表
        ],
        maint: [
            "1", "2", "3", "4","7","8"
        ],
        user: ["1", "2", "4","7"], // 普通用户的权限列表
    });

    // 定义一个方法 handleSet，用于设置 key 的值
    function handleSet(val: string[]) {
        key.value = val; // 将传入的值赋给响应式引用 key
    }

    // 返回一个对象，包含 key、defaultList 和 handleSet，供组件使用
    return {
        key,
        defaultList,
        handleSet,
    };

    // 以下部分是注释掉的代码，原本用于使用旧的状态和动作定义方式
    // state: () => {
    // 	const keys = localStorage.getItem('ms_keys');
    // 	return {
    // 		key: keys ? JSON.parse(keys) : <string[]>[], // 初始化 key 的值
    // 		defaultList: <ObjectList>{
    // 			admin: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'], // 默认管理员权限列表
    // 			user: ['1', '2', '3', '11', '13', '14', '15'] // 默认用户权限列表
    // 		}
    // 	};
    // },
    // actions: {
    // 	handleSet(val: string[]) {
    // 		this.key = val; // 设置 key 的值
    // 	}
    // }
});
