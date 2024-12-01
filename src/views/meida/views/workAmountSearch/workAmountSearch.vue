<template>
  <el-card class="card">
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

    <div class="filter-section">
      <div v-if="option=='1'">
        <el-select
            v-model="searchInput"
            multiple
            placeholder="选择年级"
            style="width: 250px; margin-right: 10px;"
        >
          <el-option
              v-for="grade in grades"
              :key="grade"
              :label="grade"
              :value="grade"
          />
        </el-select>
      </div>
      <div v-if="option=='2'">
        <el-date-picker
            v-model="searchTime.startTime"
            type="date"
            placeholder="起始日期"
            unlink-panels
            style="margin-right: 5px; width: 100px;"
        />
        <span style="font-size:10px">至</span>
        <!-- 结束日期选择 -->
        <el-date-picker
            v-model="searchTime.endTime"
            type="date"
            placeholder="结束日期"
            unlink-panels
            style="margin-right: 5px; margin-left: 5px;  width: 100px;"
        />
      </div>
      <div v-if="option=='3'">
        <el-cascader
            v-model="searchInput"
            :options="maintPersons"
            :props="props"
            filterable
            clearable
            style="width: 250px; margin-right: 10px; overflow: hidden"
        />
      </div>
      <button class="button" @click="onSearch">查询</button>
      <button class="button-reset" @click="onReset">重置</button>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" style="margin-top: 10px; height: 270px"
              @row-click="onRowClick">
      <el-table-column label="姓名" prop="name"/>
      <el-table-column label="年级" prop="startYear"/>
      <el-table-column label="任务数" prop="recordAmount"/>
      <el-table-column label="维护量" prop="workAmount"/>
    </el-table>
  </el-card>
  <el-card class="card" style="margin-top: 5px; height: 350px; overflow-y: auto" @scroll="handleScroll">
    <el-timeline class="expandable-timeline">

      <el-timeline-item
          v-for="(item, index) in timelineData.data"
          :key="index"
          :timestamp="item.finishTime"
          placement="top"
      >
        <el-card>
          <div>
            <div class="timeline-header">
              <h4 class="timeline-title">
                {{ item.buildingName }}{{ item.unit }}{{ item.room }}
              </h4>
              <span class="work-amount">+{{ item.workAmount }}</span>
            </div>
            <div class="timeline-content">
              <p class="description"><strong>问题：</strong>{{ item.maintDescription }}</p>
              <p class="note"><strong>解决方法：</strong>{{ item.note }}</p>
              <p class="completer"><strong>参与者：</strong>{{ item.completerName }}</p>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <p v-if="loading" class="loading-text">加载中...</p>
    <p v-if="noMoreData" class="no-more-data-text">没有更多数据了</p>
  </el-card>

</template>

<script setup lang="ts">
import {ArrowDown} from "@element-plus/icons-vue";
import {computed, onMounted, ref} from "vue";
import {getAllStartYearApi, listUserByYearApi} from "../../../../api/user";
import {
  getWorkAmountByStartYearApi,
  getWorkAmountByTimeApi,
  listWorkAmountByUserIdsApi
} from "../../../../api/work-amount";
import {formatDate, formatDateToISO, transformDataToCascaderFormat} from "../../../../utils/formatDateToIS0";
import {getFinishWhListApi, pageMaintByUserIdsAndTimeApi, pageMaintsByUserIdApi} from "../../../../api/maint";

const option = ref<string | null>("1");
const grades = ref();
const maintPersons = ref();
const searchInput = ref();
const searchTime = ref({
  startTime: "",
  endTime: ""
});
const tableData = ref();
const timelineData = ref({
  data: [],
  userId: 0,
  isDefault: true
});
const optionLabels: Record<string, string> = {
  "1": "年级",
  "2": "时间段",
  "3": "维护员",
};

const props = {
  multiple: true,
  emitPath: false,
};

const page = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const loading = ref(false); // 是否正在加载
const noMoreData = ref(false); // 是否没有更多数据

const optionLabel = computed(() => option.value ? optionLabels[option.value] : null);

const handleCommand = (value: string) => {
  option.value = value;
  // searchInput.value = "";
  // queryMaint();
};

const tableLoading = ref(false);

const getData = () => {
  tableLoading.value = true;
  listUserByYearApi().then((res) => {
    maintPersons.value = transformDataToCascaderFormat(res.data.data);
  });
  getAllStartYearApi().then((res) => {
    grades.value = res.data.data || [];
    if (grades.value.length > 0) {
      searchInput.value = [grades.value[grades.value.length - 1]];
      getWorkAmountByStartYearApi(grades.value[grades.value.length - 1], 1).then(
          (res) => {
            tableData.value = res.data.data;
            tableLoading.value = false;
          }
      );
    }
  });
  initTimeLineData();
}

const initTimeLineData = () => {
  if (loading.value || noMoreData.value) return;

  loading.value = true;

  getFinishWhListApi(page.value.pageNum, page.value.pageSize, 1).then((res) => {
    if (res.data.code == 200) {
      const data = res.data.data.list.map((item: any) => ({
        ...item,
        createTime: formatDate(item.createTime),
        updateTime: formatDate(item.updateTime),
        finishTime: formatDate(item.finishTime),
      }));
      if (res.data.data.list.length < page.value.pageSize) {
        noMoreData.value = true
      }
      timelineData.value.data = [...timelineData.value.data, ...data];
      page.value.totalItems = res.data.data.total;
      localStorage.setItem(String(page.value.currentPage), JSON.stringify(tableData.value));
    }
    page.value.pageNum++;
    tableLoading.value = false;
    loading.value = false; // 加载完成
  })
}

const timeLineByUserId = (userId: any) => {
  if (noMoreData.value) return;

  if (option.value == "1" || option.value == "3") {
    pageMaintsByUserIdApi(timelineData.value.userId, page.value.pageNum, page.value.pageSize, 1).then((res) => {
      if (res.data.code == 200) {
        const data = res.data.data.list.map((item: any) => ({
          ...item,
          createTime: formatDate(item.createTime),
          updateTime: formatDate(item.updateTime),
          finishTime: formatDate(item.finishTime),
        }));
        if (res.data.data.list.length < page.value.pageSize) {
          noMoreData.value = true
        }
        timelineData.value.data = [...timelineData.value.data, ...data];
        page.value.totalItems = res.data.data.total;
        localStorage.setItem(String(page.value.currentPage), JSON.stringify(tableData.value));
      }
      page.value.pageNum++;
      tableLoading.value = false;
      loading.value = false; // 加载完成
    })
  } else if (option.value == "2") {
    pageMaintByUserIdsAndTimeApi(page.value.pageNum, page.value.pageSize, formatDateToISO(searchTime.value.startTime), formatDateToISO(searchTime.value.endTime), timelineData.value.userId, 1).then((res) => {
      if (res.data.code == 200) {
        const data = res.data.data.list.map((item: any) => ({
          ...item,
          createTime: formatDate(item.createTime),
          updateTime: formatDate(item.updateTime),
          finishTime: formatDate(item.finishTime),
        }));
        if (res.data.data.list.length < page.value.pageSize) {
          noMoreData.value = true
        }
        timelineData.value.data = [...timelineData.value.data, ...data];
        page.value.totalItems = res.data.data.total;
        localStorage.setItem(String(page.value.currentPage), JSON.stringify(tableData.value));
      }
      page.value.pageNum++;
      tableLoading.value = false;
      loading.value = false; // 加载完成
    })
  }
}

const onSearch = () => {
  if (option.value == 1) {
    const selectedGrades = Object.values(searchInput.value).join(",");
    getWorkAmountByStartYearApi(selectedGrades, 1).then((res) => {
      tableData.value = res.data.data;
      tableLoading.value = false;
    });
  } else if (option.value == 2) {
    getWorkAmountByTimeApi(formatDateToISO(searchTime.value.startTime), formatDateToISO(searchTime.value.endTime), 1).then((res) => {
      tableData.value = res.data.data;
      tableLoading.value = false;
    });
  } else if (option.value == 3) {
    const userIds = searchInput.value.join(",");
    listWorkAmountByUserIdsApi(userIds, 1).then((res) => {
      tableData.value = res.data.data;
      tableLoading.value = false;
    });
  }
}

const onReset = () => {
  searchTime.value.startTime = "";
  searchTime.value.endTime = "";
  searchInput.value = "";
  noMoreData.value=false;
  getData();
}

const onRowClick = (row: any) => {
  page.value.pageNum = 1;
  page.value.total = 0;
  timelineData.value.data = [];
  console.log("row-click");
  timelineData.value.isDefault = false;
  timelineData.value.userId = row.userId;
  timeLineByUserId();
}

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5) {
    if (timelineData.value.isDefault) {
      initTimeLineData(); // 滑到底部，加载更多数据
    } else {
      timeLineByUserId();
    }
  }
};

onMounted(() => {
  getData();
})

</script>

<style scoped>
.card {
  width: 95%;
  margin: 20px auto 0;
}

.filter-section {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  text-align: center; /* 文本水平居中（针对行内内容） */
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

::v-deep .el-input__prefix-inner {
  display: none;
}

::v-deep .el-cascader__tags {
  max-height: 30px;
  max-width: 250px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

::v-deep .el-input__inner {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* 时间线项样式 */
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.timeline-title {
  margin: 0;
  font-size: 16px;
}

.work-amount {
  color: #4baf17; /* Element UI 主题色 */
  font-size: 14px;
}

.description, .note, .completer {
  margin: 5px 0;
  font-size: 14px;
}

/* 加载和无更多数据的样式 */
.loading-text, .no-more-data-text {
  text-align: center;
  color: #909399; /* 轻微的灰色 */
  font-size: 14px;
}

/* 滚动条样式 */
.card::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
  height: 8px;
}

.card::-webkit-scrollbar-thumb {
  background-color: #c0c4cc; /* 滚动条颜色 */
  border-radius: 4px;
}

.card::-webkit-scrollbar-track {
  background-color: #fff; /* 滚动条轨道颜色 */
  border-radius: 4px;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .timeline-title {
    font-size: 14px;
  }

  .work-amount {
    font-size: 12px;
  }

  .description, .note, .completer {
    font-size: 12px;
  }
}
</style>