<template>
  <div class="mobile-header">
    <div class="header-title" @click="toHome">{{ title }}</div>
    <div class="header-menu" @click="toggleMenu">
      <el-icon :size="20" color="white">
        <Menu/>
      </el-icon>
    </div>
    <!-- 右侧滑出的菜单 -->
    <el-drawer
        v-model="menuVisible"
        direction="rtl"
        size="300px"
        @close="onMenuClose"
    >
      <template #header>
        <div class="custom-header">
          <div class="user-info">
            <div class="user-info-cont">
              <div class="user-info-name">{{ user.name }}</div>
              <div id="info">
                <span>账号: {{ user.username }}</span>
                <span>权限: {{ user.permission }}</span>
                <span>部门: {{ user.organizationName }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <ul class="menu-list">
        <li class="break" @click="navigateTo('/dashboard')">首页</li>
        <li @click="navigateToAdd">添加维护</li>
        <li @click="navigateTo('/search')">维护查询</li>
        <li class="break" @click="navigateTo('/amount')">维护量查询</li>
        <li @click="navigateTo('/user')">用户管理</li>
        <li class="break" @click="navigateTo('/worker')">维护员管理</li>
        <li @click="navigateTo('/ip')">IP分配</li>
        <li class="break" @click="navigateTo('/info')">信息管理</li>
        <li @click="logout" class="logout-button">退出登录</li>
      </ul>
    </el-drawer>
  </div>
  <div id="zhanwei"/>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {ElDrawer, ElIcon, ElMessage} from 'element-plus';
import {Menu} from '@element-plus/icons-vue';
import {useUserStore} from "../../../../stores/user";
import {logoutApi} from "../../../../api";

// 响应式变量
const title = ref('济南大学MSU');
const menuVisible = ref(false);
const user = useUserStore();
const router = useRouter();

// 切换菜单的显示状态
const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
};

// 关闭菜单时的逻辑
const onMenuClose = () => {
  console.log('菜单已关闭');
};

// 跳转到特定页面
const navigateTo = (path: string) => {
  router.push(path);
  menuVisible.value = false; // 关闭菜单
};

const toHome = () => {
  router.push("/dashboard");

}

// 退出登录
const logout = async () => {
  // 清理本地存储
  localStorage.removeItem("ms_username");
  router.push("/login");
  user.outLogin();

  try {
    await logoutApi();
    ElMessage.success("登出成功");
  } catch (error) {
    ElMessage.error("登出失败，请稍后重试");
  }
};

const navigateToAdd = () => {
  router.push({name: "dashboard", query: {add: true}});
  menuVisible.value = false; // 关闭菜单
}
</script>

<style scoped>
#zhanwei {
  height: 30px;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  background-color: #242f42;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-radius: 3px;
}

.header-title {
  margin: 0;
  font-size: 18px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-list li:last-child {
  border-bottom: none; /* 移除最后一个元素的下边框 */
}

.menu-list li:hover {
  background-color: #f5f5f5;
}

.logout-button {
  color: red; /* 样式化退出按钮 */
}

.user-info-name {
  color: black;
  font-size: 20px;
}

::v-deep .el-drawer__header {
  margin-bottom: 0;
  padding: 14px;
}

::v-deep .el-drawer__body {
  padding: 14px;
}

::v-deep .el-drawer__close-btn {
  position: relative;
  top: -20px;
  font-size: larger;
  right: -1px;
}

#info span {
  font-size: 12px;
  margin-right: 5px;
}

.break {
  border-bottom: 1px solid #ddd; /* 添加底部横线 */
}
</style>
