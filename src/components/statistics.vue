<template>
  <el-table :show-header="false" :data="gzlList" id="work-amount">
    <template #empty>
      <p>本月还没有维护</p>
    </template>
    <el-table-column>
      <template #default="scope">
        <span style="text-align: left; display: inline-block; width: 100%">
          {{ scope.row.name }}
        </span>
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <!-- 空列，可在需要时添加内容 -->
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <span style="text-align: right; display: inline-block; width: 100%">
          {{ scope.row.workAmount }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts" name="dashboard">
import { ref, onMounted, defineExpose, defineProps, watch } from "vue";
import { listWorkAmountByMonthApi } from "../api/work-amount";

// 定义 props
const props = defineProps<{
  month: string;
}>();

// 工作量列表
const gzlList = ref([]);

// 获取当前时间
const nowTime = new Date();

// 方法：格式化日期为 ISO 格式
function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// 方法：获取数据
const getData = (month: string = formatDateToISO(nowTime)) => {
  listWorkAmountByMonthApi(month).then((res) => {
    if (res.data.code === 200) {
      gzlList.value = res.data.data;
    }
  });
};

// 监听 props.month 的变化
watch(
    () => props.month,
    (newValue) => {
      getData(newValue);
    }
);

// 页面加载时获取数据
onMounted(() => {
  getData();
});

// 公开方法
defineExpose({
  getData,
});
</script>

<style>
#work-amount {
  overflow-y: auto; /* 设置滚动条 */
  height: 240px; /* 最大高度 */
}
</style>
