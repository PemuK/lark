import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
    "user",
    () => {
        const id = ref(0);
        const username = ref("");
        const name = ref("");
        const password = ref(null);
        const phoneNumber = ref(null);
        const startYear = ref(null);
        const organizationId = ref(0);
        const organizationName = ref("");
        const createTime = ref("");
        const updateTime = ref("");
        const token = ref(""); // 添加 token
        const status = ref(0);
        const login = ref(false); // 添加 login 状态
        const permission = ref(""); // 添加 permission

        function updateUser(userInfo: any) {
            id.value = userInfo.id;
            username.value = userInfo.username;
            name.value = userInfo.name;
            password.value = userInfo.password;
            phoneNumber.value = userInfo.phoneNumber;
            startYear.value = userInfo.startYear;
            organizationId.value = userInfo.organizationId;
            organizationName.value = userInfo.organizationName;
            createTime.value = userInfo.createTime;
            updateTime.value = userInfo.updateTime;
            token.value = userInfo.token; // 更新 token
            status.value = userInfo.status;
            login.value = true; // 设置为登录状态
            permission.value = userInfo.permission; // 更新 permission
        }

        function refreshUserCache() {
            const userObj = {
                id: id.value,
                username: username.value,
                name: name.value,
                password: password.value,
                phoneNumber: phoneNumber.value,
                startYear: startYear.value,
                organizationId: organizationId.value,
                organizationName: organizationName.value,
                createTime: createTime.value,
                updateTime: updateTime.value,
                token: token.value, // 存储 token
                status: status.value,
                login: login.value, // 存储 login 状态
                permission: permission.value, // 存储 permission
            };
            localStorage.setItem("user", JSON.stringify(userObj));
        }

        function restoreUser() {
            const userObj = localStorage.getItem("user");

            if (userObj) {
                const parsedUser = JSON.parse(userObj);
                updateUser(parsedUser);
                return true;
            }
            return false;
        }

        function toLogin(userInfo: any) {
            login.value = true;
            updateUser(userInfo);
            refreshUserCache();
        }

        function outLogin() {
            id.value = 0;
            username.value = "";
            name.value = "";
            password.value = null;
            phoneNumber.value = null;
            startYear.value = null;
            organizationId.value = 0;
            organizationName.value = "";
            createTime.value = "";
            updateTime.value = "";
            token.value = ""; // 清空 token
            status.value = 0;
            login.value = false; // 设置为登出状态
            permission.value = ""; // 清空 permission
            localStorage.removeItem("user"); // 清除缓存
        }

        // Return the state and methods
        return {
            id,
            username,
            name,
            password,
            phoneNumber,
            startYear,
            organizationId,
            organizationName,
            createTime,
            updateTime,
            token, // 返回 token
            status,
            login, // 返回 login 状态
            permission, // 返回 permission
            updateUser,
            refreshUserCache,
            restoreUser,
            toLogin, // 登录函数
            outLogin, // 登出函数
        };
    }
);
