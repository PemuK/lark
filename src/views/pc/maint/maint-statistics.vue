<template>
  <el-row :gutter="15">
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="weekAmount?.recordAmount || 0">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              周任务数
              <el-tooltip
                effect="dark"
                content="本周维护任务总数，小写为维护量"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <template #suffix>
            <div>
              <span style="font-size: 0.6em; color: grey">{{
                weekAmount?.workAmount || 0
              }}</span>
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="8">
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
                  <Warning />
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
              <ArrowLeft />
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
              <ArrowRight />
            </el-icon>
          </el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="totalAmount?.recordAmount || 0">
          <template #title>
            <div style="display: inline-flex; align-items: center">完成总数</div>
          </template>
          <template #suffix>
            <div>
              <span style="font-size: 0.6em; color: grey">{{
                totalAmount?.workAmount || 0
              }}</span>
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
  </el-row>
  <div>
    <el-card id="table">
      <div>
        <span class="text-select">统计依据：</span>
        <el-radio-group v-model="radio2">
          <el-radio-button label="年级" value="4" />
          <el-radio-button label="时间段" value="1" />
          <el-radio-button label="维护员" value="2" />
          <!-- <el-radio-button label="维护员+时间段" value="3" /> -->
        </el-radio-group>
      </div>
      <div id="select-list">
        <el-form :inline="true" label-width="100px">
          <div v-if="radio2 === '1'">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="选择开始时间"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="终止时间">
              <el-date-picker
                v-model="endTime"
                type="date"
                placeholder="选择结束时间"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="select(1)">查询</el-button>
              <el-button type="primary" @click="reset"> 重置 </el-button>
            </el-form-item>
          </div>
          <div v-else-if="radio2 === '2'">
            <el-form-item label="维护员">
              <div class="m-4">
                <el-cascader
                  v-model="selectedPerson"
                  :options="maintPeople"
                  :props="props"
                  clearable
                  style="width: 700px"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="select(2)">查询</el-button>
              <el-button type="primary" @click="reset"> 重置 </el-button>
            </el-form-item>
          </div>
          <!-- <div v-else-if="radio2 === '3'">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="选择开始时间"
              />
            </el-form-item>
            <el-form-item label="终止时间">
              <el-date-picker v-model="endTime" type="date" placeholder="选择结束时间" />
            </el-form-item>
            <el-form-item label="维护员">
              <el-select
                v-model="selectedPerson"
                multiple
                placeholder="选择维护员"
                style="width: 200px"
              >
                <el-option
                  v-for="person in persons"
                  :key="person.value"
                  :label="person.label"
                  :value="person.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="select(3)">查询</el-button>
            </el-form-item>
          </div> -->
          <div v-else-if="radio2 === '4'">
            <el-form>
              <el-form-item label="年级">
                <el-select
                  v-model="selectedGrade"
                  multiple
                  placeholder="选择年级"
                  style="width: 300px"
                >
                  <el-option
                    v-for="grade in grades"
                    :key="grade"
                    :label="grade"
                    :value="grade"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="select(4)">查询</el-button>
                <el-button type="primary" @click="reset"> 重置 </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-form>
      </div>
    </el-card>

    <el-card id="test">
      <el-table
        :data="tableData"
        style="width: 100%; height: 525px"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        v-loading="tableLoading"
        @expand-change="handleExpandChange"
      >
        <el-table-column label="排名" width="100px">
          <template #default="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="startYear" label="年级" />
        <el-table-column prop="workAmount" label="维护量" />
        <el-table-column prop="recordAmount" label="任务数" />

        <el-table-column type="expand" class="expandable-row">
          <template #default="scope">
            <el-row v-loading="expandLoading" class="expandable-content-row">
              <el-col :span="24">
                <div class="expandable-content">
                  <el-timeline class="expandable-timeline">
                    <el-timeline-item
                      v-for="(item, index) in timelineData"
                      :key="index"
                      :timestamp="item.finishTime"
                      placement="top"
                    >
                      <el-card class="timeline-card">
                        <div class="card-header">
                          <h4>{{ item.buildingName }}{{ item.unit }}{{ item.room }}</h4>
                          <span class="work-amount">+{{ item.workAmount }}</span>
                        </div>
                        <p class="description">{{ item.maintDescription }}</p>
                        <p class="note">{{ item.note }}</p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <!-- <timeline></timeline> -->
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUpdated, onUnmounted } from "vue";

import {
  getWorkAmountByStartYearApi,
  getTotalWorkAmountApi,
  getWeekAmountApi,
  getMonthAmountApi,
  getWorkAmountByTimeApi,
  listWorkAmountByUserIdsApi,
  listWorkAmountByMonthApi,
} from "../../../api/work-amount";

import { listUserByYearApi, getAllStartYearApi } from "../../../api/user";

import {
  getMaintsByUserIdApi,
  listMaintByUserIdsAndMonthApi,
  listMaintByUserIdsAndTimeApi,
} from "../../../api/maint";

const radio2 = ref("4");
const weekAmount = ref();
const monAmount = ref();
const totalAmount = ref();
const nowTime = new Date();
const startTime = ref<Date | null>(null);
const endTime = ref<Date | null>(null);
const selectedGrade = ref<any>("");
const grades = ref([]);
const tableData = ref<any[]>([]);
const maintPeople = ref<any>();
const tableLoading = ref(false);
const expandLoading = ref(false);
const timelineData = ref<any[]>([]);
const selectedPerson = ref();
const type = ref(4);
// 控制 tooltip 可见性的变量
const tooltipVisible = ref(false);

const reset = () => {
  selectedGrade.value = "";
  selectedPerson.value = "";
  startTime.value = null;
  endTime.value = null;
  type.value = 4;
  radio2.value = "4";
  getData();
};
onMounted(() => {
  // totalAmount.workAmount = localStorage.getItem("total_amount")
  getData();
});

interface TableData {
  date: string;
  name: string;
  address: string;
  grade: string;
}

const props = {
  multiple: true,
  emitPath: false,
};

// Get the current year and month
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth() + 1); // Months are 0-indexed, so add 1
const monthTime = ref(new Date(currentYear.value, currentMonth.value - 1)); // 使用年份和月份创建 Date
// 更新当前时间并请求新的月份数据
const updateMonthTimeAndFetch = () => {
  monthTime.value = new Date(currentYear.value, currentMonth.value - 1); // 更新日期
  fetchMonthAmount(); // 请求新的月份数据
};

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

const fetchMonthAmount = () => {
  getMonthAmountApi(formatDateToISO(monthTime.value)).then((res) => {
    monAmount.value = res.data.data;
  });
};

const monthSearch = () => {
  tableLoading.value = true;
  type.value = 3;
  listWorkAmountByMonthApi(formatDateToISO(monthTime.value)).then((res) => {
    tableData.value = res.data.data;
    tableLoading.value = false;
  });
};

const expands = ref<any[]>([]);
const getRowKeys = (row: any) => {
  return row.userId;
};
function handleExpandChange(row: any, expandRows: any) {
  // 如果有行被展开，将 expands 数组设置为仅包含当前行的 userId
  if (expandRows.length > 0) {
    expands.value = [row.userId]; // 直接将展开行的 ID 作为数组赋值
    timelineData.value = []; // 清除之前行的时间线数据
  } else {
    // 如果没有行被展开，清空 expands 数组
    expands.value = [];
  }

  // 设置加载状态，并为新展开的行获取数据
  expandLoading.value = true;

  // 定义一个处理 API 响应的辅助函数
  const handleApiResponse = (res: any) => {
    timelineData.value = res.data.data; // 设置新的时间线数据
    expandLoading.value = false; // 停止加载
  };

  // 根据 type 值检查并调用相应的 API
  if (type.value === 4 || type.value === 2) {
    getMaintsByUserIdApi(row.userId, 1)
      .then(handleApiResponse)
      .catch((error) => {
        console.error("获取数据错误:", error);
        expandLoading.value = false; // 在发生错误时停止加载
      });
  } else if (type.value === 1) {
    // 检查 startTime 和 endTime 是否为 null
    if (startTime.value && endTime.value) {
      listMaintByUserIdsAndTimeApi(
        formatDateToISO(startTime.value),
        formatDateToISO(endTime.value),
        row.userId
      )
        .then(handleApiResponse)
        .catch((error) => {
          console.error("获取数据错误:", error);
          expandLoading.value = false; // 在发生错误时停止加载
        });
    } else {
      console.error("开始时间或结束时间为 null");
      expandLoading.value = false; // 如果时间为 null，停止加载
    }
  } else if (type.value === 3) {
    // 月份类型
    // 检查 monthTime 是否为 null
    if (monthTime.value) {
      listMaintByUserIdsAndMonthApi(formatDateToISO(monthTime.value), row.userId, 1)
        .then(handleApiResponse)
        .catch((error) => {
          console.error("获取数据错误:", error);
          expandLoading.value = false; // 在发生错误时停止加载
        });
    } else {
      console.error("月份时间为 null");
      expandLoading.value = false; // 如果月份时间为 null，停止加载
    }
  }
}

const getData = () => {
  tableLoading.value = true;
  listUserByYearApi().then((res) => {
    maintPeople.value = transformDataToCascaderFormat(res.data.data);
  });
  getAllStartYearApi().then((res) => {
    grades.value = res.data.data || [];
    if (grades.value.length > 0) {
      selectedGrade.value = [grades.value[grades.value.length - 1]];
      getWorkAmountByStartYearApi(grades.value[grades.value.length - 1], 1).then(
        (res) => {
          tableData.value = res.data.data;
          tableLoading.value = false;
        }
      );
    }
  });

  getWeekAmountApi(formatDateToISO(nowTime)).then((res) => {
    if (res.data.code === 200) {
      weekAmount.value = res.data.data;
    }
  });
  fetchMonthAmount();
  getTotalWorkAmountApi().then((res) => {
    totalAmount.value = res.data.data;
  });
};

const select = (selectType: number) => {
  tableLoading.value = true;

  const start = startTime.value ? formatDateToISO(startTime.value) : ""; // 如果是 null，使用空字符串
  const end = endTime.value ? formatDateToISO(endTime.value) : ""; // 如果是 null，使用空字符串

  if (selectType === 1) {
    type.value = 1;
    getWorkAmountByTimeApi(start, end, 1).then((res) => {
      tableData.value = res.data.data;
      tableLoading.value = false;
    });
  } else if (selectType === 2) {
    type.value = 2;
    const idString = selectedPerson.value.join(",");
    listWorkAmountByUserIdsApi(idString, 1).then((res) => {
      tableData.value = res.data.data;
      tableLoading.value = false;
    });
  } else if (selectType === 4) {
    type.value = 4;
    const selectedGradesString = Object.values(selectedGrade.value).join(",");
    getWorkAmountByStartYearApi(selectedGradesString, 1).then((res) => {
      tableData.value = res.data.data;
      tableLoading.value = false;
    });
  } else {
    tableLoading.value = false; // 处理其他 selectType 情况
  }
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
function transformDataToCascaderFormat(data: Record<string, Array<any>>) {
  return Object.keys(data).map((year) => ({
    value: year,
    label: year,
    children: data[year].map((item, index) => ({
      value: `${item.id}`,
      label: `${item.name}`,
      // Add more properties from your data as needed
    })),
  }));
}
</script>

<style scoped>
#test {
  margin-top: 5px;
  width: 100%;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
  user-select: none;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

#select-list {
  position: relative;
  top: 17px;
}

.statistic-card {
  height: 70%;
  padding: 17px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
  user-select: none;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}

#table {
  margin-top: 3px;
  width: 100%;
  /* margin-left: 5px; */
}

.text-select {
  position: relative;
  top: 5px;
  font-size: 13px;
}

.expend {
  background: black;
}

.expandable-row {
  background: black; /* Change this to your desired background color */
}

.expandable-content {
  width: 100%;
  max-height: 400px; /* Ensure it doesn't exceed 300px */
  margin: 0 auto; /* Center content horizontally */
  overflow-y: auto; /* Enable vertical scrolling when content exceeds max height */
  padding: 10px; /* Add padding inside the content area */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  background-color: #f5f5f5; /* Set a background color for the content area */
  border: 1px solid #ddd; /* Add a border to define the content area */
  border-radius: 4px; /* Optional: Add rounded corners for a nicer look */
}
.expandable-row {
  --expandable-transition-duration: 0.3s;
}

.expandable-content-row {
  padding: 10px;
}

.expandable-content {
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 10px;
  overflow-y: auto;
}

.expandable-timeline {
  min-width: 100%;
  margin-top: 10px;
}

.timeline-card {
  padding: 10px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-card h4 {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 16px;
}

.timeline-card .description {
  color: #606266;
  margin-bottom: 5px;
  font-size: 14px;
}

.timeline-card .note {
  color: #909399;
  font-size: 13px;
}

.timeline-card .work-amount {
  color: #32cd32;
  font-weight: bold;
  font-size: 14px;
}
/* /deep/ .el-table__expand-icon {
  visibility: hidden;
} */

#month {
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
