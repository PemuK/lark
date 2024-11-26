<template>
  <el-col @touchstart="handleTouchStart"
          @touchend="handleTouchEnd">
    <div class="statistic-card">
      <el-statistic :value="monAmount?.recordAmount || 0">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            本月任务数
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
            <span style="font-size: 0.6em; color: grey">
              {{ monAmount?.workAmount || 0 }}
            </span>
          </div>
        </template>
      </el-statistic>
      <div
          id="month"
      >
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
import {defineEmits, onMounted, ref, watch} from "vue";
import {getMonthAmountApi} from "../../../../api/work-amount";
import {formatDateToISO} from "../../../../utils/formatDateToIS0";

const monAmount = ref();
const type = ref(4);
const emit = defineEmits(["month", "time"]);
const props = defineProps(["update"]);
// 控制 tooltip 可见性的变量
const tooltipVisible = ref(false);

onMounted(() => {
  getData();
});

watch(() => props.update, (newVal) => {
  getData();
})

// 获取当前年份和月份
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth() + 1); // 月份是从0开始的，所以加1
const monthTime = ref(new Date(currentYear.value, currentMonth.value - 1));

// 记录触摸开始的位置
const startX = ref(0);
const startY = ref(0);

// 处理触摸开始事件
const handleTouchStart = (event) => {
  const touch = event.touches[0];
  startX.value = touch.clientX;
  startY.value = touch.clientY;
};

// 处理触摸结束事件
const handleTouchEnd = (event) => {
  const touch = event.changedTouches[0];
  const endX = touch.clientX;
  const endY = touch.clientY;

  // 计算滑动距离
  const deltaX = endX - startX.value;
  const deltaY = endY - startY.value;

  // 判断滑动方向
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      // 右滑
      prevMonth();
    } else {
      // 左滑
      nextMonth();
    }
  }

  // 重置触摸坐标
  startX.value = 0;
  startY.value = 0;
};

// 获取月度数据
const fetchMonthAmount = () => {
  emit("month", formatDateToISO(monthTime.value));
  emit("time", monthTime.value);
  getMonthAmountApi(formatDateToISO(monthTime.value)).then((res) => {
    monAmount.value = res.data.data;
  });
};

const getData = () => {
  fetchMonthAmount();
};


// 处理上个月
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  updateMonthTimeAndFetch();
};

// 处理下个月
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  updateMonthTimeAndFetch();
};

// 更新当前时间并请求新的月份数据
const updateMonthTimeAndFetch = () => {
  monthTime.value = new Date(currentYear.value, currentMonth.value - 1);
  fetchMonthAmount();
};
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
