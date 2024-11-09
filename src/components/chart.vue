<template>
  <div class="chart-container">
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, defineExpose } from "vue";
import * as echarts from "echarts";
import { getMonthAmountApi } from "../api/work-amount";
import { ElMessage } from "element-plus";

// Reference to the chart container
const chartRef = ref<HTMLDivElement | null>(null);

const getLastSixMonths = () => {
  const monthsInChinese = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const result: { month: string; year: number }[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 6; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    result.push({
      month: monthsInChinese[date.getMonth()],
      year: date.getFullYear(),
    });
  }

  return result.reverse(); // Ensure the months are in the correct order
};

const initChart = (
  months: string[],
  maintAmount1: number[],
  maintAmount2: number[],
  totalAmount: number[]
) => {
  if (!chartInstance) return;
  const option = {
    title: {
      text: "维护统计",
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: 500,
        color: "black",
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const { dataIndex } = params[0];
        const value1 = maintAmount1[dataIndex];
        const value2 = maintAmount2[dataIndex];
        return `${params[0].name}<br/>任务数: ${value1}, 维护量: ${value2}`;
      },
    },
    xAxis: {
      type: "category",
      data: months,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "总工作量",
        data: maintAmount1,
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#409EFF",
          width: 3,
        },
        areaStyle: {},
      },
    ],
  };

  chartInstance.setOption(option);
};

const getData = async () => {
  const monthsData = getLastSixMonths();
  const months = monthsData.map((data) => `${data.year}-${data.month}`);
  const maintAmount1: number[] = [];
  const maintAmount2: number[] = [];

  for (const { month, year } of monthsData) {
    const response = await getMonthAmountApi(`${year}-${month}-01T00:00:00`);
    maintAmount1.push(response.data.data.recordAmount || 0);
    maintAmount2.push(response.data.data.workAmount || 0);
  }

  const totalAmount = maintAmount1.map((val, idx) => val + maintAmount2[idx]);
  if (chartInstance) {
    initChart(months, maintAmount1, maintAmount2, totalAmount);
  }
};

let chartInstance: echarts.ECharts | null = null;

const resizeChart = () => {
  chartInstance?.resize();
};

onMounted(() => {
  chartInstance = echarts.init(chartRef.value!);
  getData();
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  if (chartInstance) {
    window.removeEventListener("resize", resizeChart);
    chartInstance.dispose();
  }
});

defineExpose({
  getData,
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 26vh; /* 设置固定高度 */
  text-align: center;
}
</style>
