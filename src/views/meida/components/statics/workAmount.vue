<template>
  <el-col>
    <div class="statistic-card">
      <el-statistic :value="monAmount?.recordAmount || 0">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            月任务数
            <el-tooltip
                effect="dark"
                content="本月维护任务总数，小写为维护量"
                placement="top"
            >
              <el-icon style="margin-left: 4px" :size="12">
                <Warning/>
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #suffix>
          <div>
              <span style="font-size: 0.6em; color: grey">{{
                  monAmount?.workAmount || 0
                }}</span>
          </div>
        </template>
      </el-statistic>
      <div id="month">
        <el-button type="text" @click="prevMonth" style="color: grey">
          <el-icon>
            <ArrowLeft/>
          </el-icon>
        </el-button>

        <!-- Tooltip for the month text with v-model controlling visibility -->
        <el-tooltip
            v-model:visible="tooltipVisible"
            content="点击查看该月详细"
            placement="top"
        >
            <span
                @click="monthSearch"
                style="text-align: center; color: grey; cursor: pointer"
            >
              {{ currentYear }}年{{ currentMonth }}月
            </span>
        </el-tooltip>

        <el-button type="text" @click="nextMonth" style="color: grey">
          <el-icon>
            <ArrowRight/>
          </el-icon>
        </el-button>
      </div>
    </div>
  </el-col>
</template>

<script setup lang="ts">
import {onMounted, ref,defineEmits} from "vue";

import {getMonthAmountApi,} from "../../../../api/work-amount";


const monAmount = ref();
const type = ref(4);
const emit=defineEmits(['month','time'])
// 控制 tooltip 可见性的变量
const tooltipVisible = ref(false);

onMounted(() => {
  getData();
});

// Get the current year and month
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth() + 1); // Months are 0-indexed, so add 1
const monthTime = ref(new Date(currentYear.value, currentMonth.value - 1)); // 使用年份和月份创建 Date


// Function to handle month decrement
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  updateMonthTimeAndFetch(); // 更新时间并请求数据
};

// Function to handle month increment
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  updateMonthTimeAndFetch(); // 更新时间并请求数据
};
// 更新当前时间并请求新的月份数据
const updateMonthTimeAndFetch = () => {
  monthTime.value = new Date(currentYear.value, currentMonth.value - 1); // 更新日期
  fetchMonthAmount(); // 请求新的月份数据
};
const fetchMonthAmount = () => {
  emit('month',formatDateToISO(monthTime.value));
  emit('time',monthTime.value);
  getMonthAmountApi(formatDateToISO(monthTime.value)).then((res) => {
    monAmount.value = res.data.data;
  });
};

const getData = () => {
  fetchMonthAmount();
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
</script>

<style scoped>
#month {
  width: inherit;
  position: relative;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  height: 5px;
}
</style>