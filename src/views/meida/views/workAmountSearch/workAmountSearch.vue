<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          维护量查询
          <span style="font-size: 10px; margin-left: 5px; color: #888d8f;">
              (点击查看时间线)
            </span>
        </div>
        <span style="cursor: pointer; color: #2c2c2c; font-size: small" @click="">
          <el-dropdown
              ref="dropdownRef" @command="handleCommand">
          <span class="option">
            依据：{{ optionLabel || '请选择' }}
            <el-icon><arrow-down/></el-icon>
          </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="1">年级</el-dropdown-item>
                <el-dropdown-item command="2">时间段</el-dropdown-item>
                <el-dropdown-item command="3">维护员</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown></span>
      </div>

    </template>
  </el-card>
</template>

<script setup lang="ts">

import {ArrowDown} from "@element-plus/icons-vue";
</script>

<style scoped>
.card {
  width: 95%;
  margin: 20px auto 0;
}

.filter-section {
  display: flex;
  align-items: center;
}

.pagination-section {
  display: flex;
  margin: 20px 0;
  justify-content: center;
}


.option {
  display: inline-flex;
  align-items: center;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  color: #2c2c2c;
  font-size: small;
}

.option:hover {
  color: #bdbdbd;
}

::v-deep .el-card__header {
  padding: 10px;
  font-size: 15px;
}

.button {
  background-color: #242f42;
  margin: 5px;
  color: #fff;
  padding: 5px;
  width: 60px;
  height: 35px;
  border-radius: 10px;
  border-color: transparent;
}

.button:hover {
  background-color: #06090b;

}

.button-reset {
  background-color: #ffffff;
  margin: 5px;
  color: black;
  padding: 5px;
  width: 60px;
  height: 35px;
  border: 1px solid black;
  border-radius: 10px;
}

::v-deep .el-pagination.is-background .btn-next.is-active,
::v-deep .el-pagination.is-background .btn-prev.is-active,
::v-deep .el-pagination.is-background .el-pager li.is-active {
  background-color: #242f42 !important;
}

/* 全局样式调整表头 */
::v-deep .el-table__header th {
  padding: 4px;
  height: 25px;
  //font-size: 12px;
}

::v-deep .el-card__body {
  padding: 10px;
}

::v-deep(.el-dialog__wrapper) {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .el-dialog {
  margin: 0 auto;
}

</style>