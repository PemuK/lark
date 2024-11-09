<template>
  <el-table :show-header="false" :data="gzlList" id="work-amount">
    <el-table-column>
      <template #default="scope">
        <span style="text-align: left; display: inline-block; width: 100%">{{
          scope.row.name
        }}</span>
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope"> </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <span style="text-align: right; display: inline-block; width: 100%">{{
          scope.row.workAmount
        }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts" name="dashboard">
import { reactive, onMounted, defineExpose } from "vue";
import { usePermissStore } from "../stores/permiss";
import AddModal from "../components/AddModal.vue";
import { ref } from "vue";
import * as echarts from "echarts";
import imgurl from "../assets/img/img.jpg";
import { ElMessage } from "element-plus";

import { listWorkAmountByMonthApi } from "../api/work-amount";
import { listUserByStatusAndStateApi } from "../api/user";
import { getBuildingListApi } from "../api/building";
import {
  getUnFinishWhListApi,
  updateMaintStateApi,
  updateMaintRecordApi,
  listMaintTypeByStatusApi,
  reportMaintApi,
} from "../api/maint";
const nowTime = new Date();
const gzlList = ref([]);
onMounted(() => {
  getData();
});
const getData = () => {
  listWorkAmountByMonthApi(formatDateToISO(nowTime)).then((res) => {
    if (res.data.code === 200) {
      gzlList.value = res.data.data;
    }
  });
};

function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，需要加1
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

defineExpose({
  getData,
});
</script>
<style>
#work-amount {
  overflow-y: auto; /* 设置为 auto 以允许滚动 */
  max-height: 400px; /* 设置一个最大高度 */
}
</style>
