<template>
  <div class="home">
    <Header/>
    <router-view class="zhanwei" v-slot="{ Component }">
      <transition name="move" mode="out-in">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import Header from './components/structure/Header.vue';
</script>

<style scoped>
.home {
  min-height: 100vh; /* 使容器至少占满整个视口的高度 */
  display: flex; /* 使用flex布局 */
  flex-direction: column; /* 子元素垂直排列 */
  background-color: #f6f6f6; /* 设置背景色为灰色 */
  overflow-y: auto;
}

.zhanwei {
  margin-top: 20px;
}

::v-deep :root{
  --el-menu-active-color:#242f42;
}
</style>