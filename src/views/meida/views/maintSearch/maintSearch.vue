<template>
  <Transition>
    <el-card class="card" v-if="!isUpdate">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            维护查询
            <span style="font-size: 10px; margin-left: 5px; color: #888d8f;">
            (点击每行查看维护详细)
          </span>
          </div>
          <el-dropdown ref="dropdownRef" @command="handleCommand">
          <span class="option">
            依据：{{ optionLabel || '请选择' }}
            <el-icon><arrow-down/></el-icon>
          </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="1">地址</el-dropdown-item>
                <el-dropdown-item command="2">用户姓名</el-dropdown-item>
                <el-dropdown-item command="3">电话</el-dropdown-item>
                <el-dropdown-item command="4">问题</el-dropdown-item>
                <el-dropdown-item command="5">维护类型</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>

      <div class="filter-section">
        <el-input
            v-if=" option!== '5'"
            v-model="searchInput"
            :placeholder="getPlaceholder()"
            style="width: 250px; margin-right: 10px;"
        ></el-input>

        <!-- Multi-select input for 'participant' -->
        <el-select
            v-else
            v-model="searchInput"
            placeholder="请选择维护类型"
            class="handle-input mr10"
        >
          <el-option
              v-for="person in maintType"
              :key="person.id"
              :label="person.typeName"
              :value="person.id"
          ></el-option>
        </el-select>
        <button class="button" @click="onSearch">查询</button>
        <button class="button-reset" @click="onReset">重置</button>
      </div>

      <el-table v-loading="tableLoading" :data="tableData" style="margin-top: 20px;" @row-click="onRowClick">
        <el-table-column label="地址" width="90px">
          <template #default="scope">
            {{ scope.row.buildingName }}{{ scope.row.unit }}{{ scope.row.room }}
          </template>
        </el-table-column>
        <el-table-column
            prop="phoneNumber"
            label="联系电话"
            width="112px"
        ></el-table-column>
        <el-table-column prop="clientName" label="用户名" width="80px"></el-table-column>
        <el-table-column prop="maintDescription" label="问题" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="登记时间" width="100px"></el-table-column>
        <el-table-column prop="finishTime" label="填报时间" width="100px"></el-table-column>
        <el-table-column prop="adderName" label="登记人" width="80px"></el-table-column>
        <el-table-column prop="note" width="90px" label="解决方法" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="reporterName" label="填报人" width="80px"></el-table-column>
        <el-table-column
            prop="completerName"
            label="参与者"
            width="200px"
            :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="maintTypeName" label="类型" width="60px"></el-table-column>
      </el-table>

      <div class="pagination-section">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="page.totalItems"
            :current-page.sync="page.currentPage"
            :page-size="page.pageSize"
            :pager-count="5"
            @current-change="onPageChange"
        />
      </div>
    </el-card>
    <div v-else>
      <el-card class="card">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              修改维护
            </div>
            <span style="cursor: pointer; color: #2c2c2c; font-size: small" @click="toSearch">返回</span>

          </div>
        </template>
        <ModifyMaint :maintDetail="maintDetail" @close="toSearch"/>
      </el-card>
    </div>
  </Transition>
  <el-dialog :width="350" v-model="dialogVisible">
    <DetailDialog :maintDetail="maintDetail" @update="updateMaint"/>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {ArrowDown} from "@element-plus/icons-vue";
import {
  getFinishWhListApi,
  listByBuildingUnitRoomApi,
  listByClientNameApi,
  listByDescriptionApi,
  listByMaintTypeApi,
  listByPhoneNumberApi,
  listMaintTypeByStatusApi
} from "../../../../api/maint";

import {formatDate} from "../../../../utils/formatDateToIS0";
import DetailDialog from "./components/detailDialog.vue";
import ModifyMaint from "./components/modifyMaint.vue";

const isUpdate = ref(false);

const updateMaint = (msg) => {
  isUpdate.value = msg;
  dialogVisible.value = false;
}

const toSearch = () => {
  isUpdate.value = !isUpdate.value;
  getData();
}

//查询依据
const option = ref<string | null>("1");

//输入
const searchInput = ref<string>("");

//维护类型列表
const maintType = ref();

//加载状态
const tableLoading = ref(false);

//dialog可见状态
const dialogVisible = ref(false);

//传递给子组件的维护信息（单行）
const maintDetail = ref("");

const page = ref({
  currentPage: 1,
  pageSize: 8,
  totalItems: 0
});

const optionLabels: Record<string, string> = {
  "1": "地址",
  "2": "用户姓名",
  "3": "电话",
  "4": "问题",
  "5": "维护类型"
};

const apiMap = {
  '1': listByBuildingUnitRoomApi,
  '2': listByClientNameApi,
  '3': listByPhoneNumberApi,
  '4': listByDescriptionApi,
  '5': listByMaintTypeApi,
}

const tableData = ref();

onMounted(() => {
  let tableDataString = localStorage.getItem(String(page.value.currentPage));
  page.value.currentPage = Number(page.value.currentPage);
  if (tableDataString) {
    tableData.value = JSON.parse(tableDataString);
  }
  getData();
})


const optionLabel = computed(() => option.value ? optionLabels[option.value] : null);

const handleCommand = (value: string) => {
  option.value = value;
  searchInput.value = "";
  queryMaint();
};

const onSearch = (event: any) => {
  event.target.blur();
  console.log("查询条件：", searchInput.value);
  queryMaint();
};

const onReset = () => {
  searchInput.value = "";
  page.value.currentPage = 1;
  queryMaint();
};

const onRowClick = (row: any) => {
  console.log("行数据：", row);
  maintDetail.value = row;
  dialogVisible.value = true;
};

const onPageChange = (pageNum: number) => {
  page.value.currentPage = pageNum;
  console.log("当前页：", pageNum);
  queryMaint();
};

const getPlaceholder = () => {
  if (option.value) {
    if (option.value === "1") {
      return "请输入地址";
    } else if (option.value === "2") {
      return "请输入用户姓名";
    } else if (option.value === "3") {
      return "输入电话";
    } else if (option.value == "4") {
      return "输入问题";
    } else if (option.value == "5") {
      return "";
    }
  }
}

const getData = () => {
  listMaintTypeByStatusApi(1).then(res => {
    if (res.data.code == 200) {
      maintType.value = res.data.data;
    }
  })
  queryMaint();
}


const queryMaint = () => {
  tableLoading.value = true;
  if (option.value && searchInput.value) {
    const api = apiMap[option.value];
    if (api) {
      api(page.value.currentPage, page.value.pageSize, searchInput.value, 1).then(res => {
        if (res.data.code == 200) {
          tableData.value = res.data.data.list.map((item: any) => ({
            ...item,
            createTime: formatDate(item.createTime),
            updateTime: formatDate(item.updateTime),
            finishTime: formatDate(item.finishTime),
          }));
          page.value.totalItems = res.data.data.total;
          localStorage.setItem(String(page.value.currentPage), JSON.stringify(tableData.value));
        }
        tableLoading.value = false;

      })

    }
  } else {
    getFinishWhListApi(page.value.currentPage, page.value.pageSize, 1).then((res) => {
      if (res.data.code == 200) {
        tableData.value = res.data.data.list.map((item: any) => ({
          ...item,
          createTime: formatDate(item.createTime),
          updateTime: formatDate(item.updateTime),
          finishTime: formatDate(item.finishTime),
        }));
        page.value.totalItems = res.data.data.total;
        localStorage.setItem(String(page.value.currentPage), JSON.stringify(tableData.value));
      }
      tableLoading.value = false;
    })
  }
}
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
