<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="sidebar.collapse" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened>
      <template v-for="item in items" :key="item.index">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" v-permiss="item.permiss">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs" :key="subItem.index">
              <el-sub-menu v-if="subItem.subs" :index="subItem.index" v-permiss="subItem.permiss">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" v-permiss="subItem.permiss"
                @click="handleMenuItemClick(subItem.index)">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" v-permiss="item.permiss" @click="handleMenuItemClick(item.index)">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
  <AddModal :dialogFormVisible="dialogFormVisible" @custom-event="closeDialog"></AddModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useSidebarStore } from "../stores/sidebar";
import AddModal from "./AddModal.vue";
import { useRoute, useRouter } from "vue-router";

const items: any[] = [
  {
    icon: "Odometer",
    index: "/dashboard", // 路由路径
    title: "首页", // 菜单标题
    permiss: "1", // 权限值
  },
  {
    icon: "Calendar",
    index: "1", // 权限值，不是路由路径
    title: "维护工作记录", // 菜单标题
    permiss: "2", // 权限值
    subs: [
      // 子菜单
      {
        index: "/table-finished", // 路由路径
        title: "已完成维护", // 菜单标题
        permiss: "2", // 权限值
      },
      {
        index: "/table-unfinished", // 路由路径
        title: "添加维护", // 菜单标题
        permiss: "3", // 权限值
      },
    ],
  },
  {
    icon: "DocumentCopy",
    index: "/maint-statistics", // 路由路径
    title: "工作量统计", // 菜单标题
    permiss: "4", // 权限值
  },
  {
    icon: "User",
    index: "/user-controller", // 路由路径
    title: "用户管理", // 菜单标题
    permiss: "5", // 权限值
    subs: [
      // 子菜单
      {
        index: "/user-controller", // 确保子菜单的路径与实际路由匹配
        title: "用户信息", // 菜单标题
        permiss: "5", // 权限值
      },
    ],
  },
  {
    icon: "DocumentCopy",
    index: "/info-manage", // 路由路径
    title: "信息管理", // 菜单标题
    permiss: "6", // 权限值
  },
];

const route = useRoute();
const router = useRouter();
const option = ref("11");
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
const dialogFormVisible = ref(false);
const closeDialog = (payload: any) => {
  dialogFormVisible.value = payload.value;
};
const formLabelWidth = "140px";

function handleMenuItemClick(index: string) {
  if (index === "/table-unfinished") {
    dialogFormVisible.value = true;
    // 取消选中状态
    setTimeout(() => {
      router.replace(onRoutes.value);
    }, 0);
  } else {
    router.push(index);
  }
}

const gzlList = ref([]);
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar>ul {
  height: 100%;
}
</style>

<style scoped>
.icon {
  padding-top: 2.3px;
  color: rgb(141, 141, 141);
}

/* 选中时的样式 */
input[type="radio"]:checked+.icon {
  color: #000000;
  /* 黑色 */
}

.radio-group {
  display: flex;
  align-items: left;
  font-size: 0.75rem;
}

.radio-group label.description {
  margin-left: 12px;
  margin-right: 10px;
}

.radio-options {
  display: flex;
  width: 100px;
  gap: 10px;
  /* 增加选项之间的间距 */
}

.radio-options input[type="radio"] {
  opacity: 0;
  position: absolute;
  left: -9999px;
}

.radio-options label {
  display: flex;
  align-items: center;
  gap: 5px;
  /* 增加标签和单选框之间的间距 */
}

.modify-input {
  width: 100%;
}

#add {
  display: flex;
  justify-content: center;
  border-right: 1px solid rgb(65, 65, 65, 0.2);
  /* Add vertical line */
  height: 510px;
}

body {
  font-family: Arial, sans-serif;
}

.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* padding: 10px; */
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  margin-left: -55px;
  flex-wrap: wrap;
  /* Ensure labels and inputs wrap on smaller screens */
}

.form-group label {
  width: 30%;
  font-size: small;
  margin-right: 10px;
  text-align: right;
}

.form-group .input,
.form-group select,
.form-group textarea {
  font-size: small;
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 0;
  /* Prevent overflow */
}

.form-group textarea {
  resize: vertical;
  height: 60px;
  /* Adjust height as needed */
}

.button-container {
  display: flex;
  justify-content: flex-end;
  /* Align buttons to the right */
  gap: 10px;
  /* Space between buttons */
  margin-top: 30px;
  /* Space above the button container */
}

.button-container button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #262626;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-container button:hover {
  background-color: #000000;
}

/* 原生 input 元素的样式 */
form {
  display: flex;
  flex-direction: column;
  /* 竖直排列子元素 */
}

select {
  width: 300px;
  height: 34px;
  border: 2px solid rgb(226, 224, 224);
  border-radius: 5px;
  text-decoration: none;
  box-shadow: none;
  /* 去除阴影 */
  background: none;
  /* 去除背景 */
  outline: none;
  /* 去除焦点时的轮廓 */
  padding: 2px;
  /* 内边距 */
  font-size: 14px;
  /* 自定义字体大小 */
  color: #000000;
  /* 自定义字体颜色 */
  transition: all 0.3s ease;
  /* 添加过渡效果 */
}

option {
  transition: all 0.3s ease;
  /* 添加过渡效果 */
}

/* 鼠标悬停时的效果 */
select:hover {
  border: 2px solid #8e8e8e;
  /* 自定义悬停边框颜色 */
}

/* 聚焦时的效果 */
select:focus {
  border: 2px solid #525252;
  /* 自定义焦点边框颜色 */
  outline: none;
  /* 去除默认焦点轮廓 */
}

input {
  width: 200px;
  height: 10px;
  border: 2px solid rgb(226, 224, 224);
  border-radius: 5px;
  text-decoration: none;
  box-shadow: none;
  /* 去除阴影 */
  background: none;
  /* 去除背景 */
  outline: none;
  /* 去除焦点时的轮廓 */
  padding: 2px;
  /* 内边距 */
  font-size: 14px;
  /* 自定义字体大小 */
  color: #000000;
  /* 自定义字体颜色 */
}

input:focus {
  border: 2px solid #525252;
  /* 自定义焦点边框颜色 */
}

input:hover {
  border: 2px solid #8e8e8e;
  /* 自定义悬停边框颜色 */
}

div {
  user-select: none;
}

.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 20px;
  color: #222;
  margin-bottom: 5px;
  font-weight: bold;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 10px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.popover-content {
  width: 100%;
  /* Ensure the popover takes full width */
  text-align: center;
  /* Center text */
  box-sizing: border-box;
  /* Include padding and border in width calculation */
}

.action-list {
  list-style: none;
  /* Remove bullet points */
  padding: 0;
  /* Remove default padding */
  margin: 0;
  /* Remove default margin */
  width: 100%;
  /* Ensure list takes full width */
}

.action-list li {
  margin-bottom: 10px;
  /* Space between items */
}

.action-button {
  display: block;
  /* Make buttons take full width */
  width: 100%;
  /* Full width */
  border: none;
  /* Remove default border */
  color: black;
  /* Button text color */
  background-color: transparent;
  /* Transparent background */
  font-size: 14px;
  /* Font size */
  text-align: center;
  /* Center text */
  cursor: pointer;
  /* Pointer cursor on hover */
  transition: background-color 0.3s;
  /* Smooth background color transition */
  box-sizing: border-box;
  /* Include padding and border in width calculation */
}

.el-dialog {
  --el-dialog-width: 50%;
  --el-dialog-margin-top: 15vh;
  --el-dialog-bg-color: var(--el-bg-color);
  --el-dialog-box-shadow: var(--el-box-shadow);
  --el-dialog-title-font-size: var(--el-font-size-large);
  --el-dialog-content-font-size: 14px;
  --el-dialog-font-line-height: var(--el-font-line-height-primary);
  --el-dialog-padding-primary: 16px;
  --el-dialog-border-radius: var(--el-border-radius-small);
  background: var(--el-dialog-bg-color);
  border-radius: var(--el-dialog-border-radius);
  box-shadow: var(--el-dialog-box-shadow);
  box-sizing: border-box;
  margin: var(--el-dialog-margin-top, 15vh) auto 50px;
  overflow-wrap: break-word;
  padding: var(--el-dialog-padding-primary);
  position: relative;
  width: 1000px;
}

.action-button:hover {
  color: #0056b3;
  /* Darker background on hover */
}

#select {
  overflow-y: auto;
  height: 455px;
}

#no-select {
  color: white;
}
</style>
