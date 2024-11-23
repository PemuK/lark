<template>
  <div class="container">
    <div class="handle-box">
      <!-- Select for choosing search criterion -->
      <el-select v-model="queryType" placeholder="查询依据" class="handle-select mr10">
        <el-option key="1" label="地址" value="address"></el-option>
        <el-option key="2" label="电话" value="phone"></el-option>
        <el-option key="3" label="姓名" value="name"></el-option>
        <el-option key="4" label="维护类型" value="type"></el-option>
        <el-option key="5" label="问题" value="description"></el-option>
      </el-select>

      <!-- Conditionally render inputs based on selected queryType -->
      <el-input
        v-if="queryType !== 'type'"
        v-model="queryValue"
        :placeholder="getPlaceholder()"
        class="handle-input mr10"
      ></el-input>

      <!-- Multi-select input for 'participant' -->
      <el-select
        v-else
        v-model="searchType"
        placeholder="请选择维护类型"
        class="handle-input mr10"
      >
        <el-option
          v-for="person in whType"
          :key="person.id"
          :label="person.typeName"
          :value="person.id"
        ></el-option>
      </el-select>

      <!-- Search button -->
      <el-button type="primary" :icon="Search" @click="handleSearch"> 搜索 </el-button>
      <el-button type="primary" @click="reset"> 重置 </el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header"
    >
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
      <el-table-column prop="clientName" label="用户名" width="55px"></el-table-column>
      <el-table-column prop="maintDescription" label="问题"></el-table-column>
      <el-table-column prop="createTime" label="登记时间" width="100px"></el-table-column>
      <el-table-column prop="finishTime" label="填报时间" width="100px"></el-table-column>
      <el-table-column prop="adderName" label="登记人" width="40px"></el-table-column>
      <el-table-column prop="note" label="解决方法"></el-table-column>
      <el-table-column prop="reporterName" label="填报人" width="40px"></el-table-column>
      <el-table-column
        prop="completerName"
        label="参与者"
        width="200px"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="maintTypeName" label="类型" width="40px"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <div class="vertical-buttons">
            <el-button
              text
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-permiss="7"
              class="button"
            >
              编辑
            </el-button>
            <el-button
              text
              :icon="Delete"
              class="red button"
              @click="handleDelete(scope.$index, scope.row.id)"
              v-permiss="8"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="所在楼">
          <select
            id="building"
            class="modify-input"
            v-model="form.building"
            placeholder="选择所在楼"
          >
            <option value="" disabled selected>选择所在楼</option>
            <option v-for="building in buildings" :key="building.id" :value="building.id">
              {{ building.buildingName }}
            </option>
          </select>
        </el-form-item>
        <el-form-item label="单元号">
          <el-input v-model="form.unit" placeholder="若无请忽略"></el-input>
        </el-form-item>
        <el-form-item label="房间号">
          <el-input v-model="form.room"></el-input>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input type="textarea" v-model="form.issue"></el-input>
        </el-form-item>
        <el-form-item label="地点描述">
          <el-input type="textarea" v-model="form.location"></el-input>
        </el-form-item>
        <el-form-item label="参与人员">
          <el-checkbox-group v-model="selectedIds">
            <el-checkbox
              v-for="person in whPerson"
              :key="person.id"
              :label="person.id"
              :value="person.id"
              size="small"
            >
              {{ person.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="维护类型">
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="type in whType"
              :key="type.id"
              :label="type.id"
              :value="type.id"
              size="small"
            >
              {{ type.typeName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="解决方案">
          <el-input type="textarea" v-model="form.note"></el-input>
        </el-form-item>
        <el-form-item label="完成状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="status in statuses"
              :key="status.id"
              :label="status.id"
              :value="status.id"
              size="small"
            >
              {{ status.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit()">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit, Search } from "@element-plus/icons-vue";
import { useSidebarStore } from "../../../stores/sidebar";

import { listUserByStatusAndStateApi } from "../../../api/user";
import { getBuildingListApi } from "../../../api/building";
import {
  getFinishWhListApi,
  listMaintTypeByStatusApi,
  updateMaintStateApi,
  updateMaintRecordApi,
  listByBuildingUnitRoomApi,
  listByClientNameApi,
  listByPhoneNumberApi,
  listByMaintTypeApi,
  listByDescriptionApi,
} from "../../../api/maint";

const tableData = ref<any[]>([]);
const pageTotal = ref(0);
const TableQuery = ref(false);
const tableLoading = ref(true);
const whPerson = ref<any[]>([]);
const queryType = ref("address");
const queryValue = ref("");
const searchType = ref();
const whType = ref<any[]>([]);
const sidebar = useSidebarStore();
const selectedBuilding = ref<number>(0);
const buildings = ref<Building[]>([]);
const selectedIds = ref<number[]>();
const selectedType = ref();
const statuses = ref([
  {
    id: 1,
    name: "完成",
  },
  {
    id: 0,
    name: "未完成",
  },
]);

watch(queryType, () => {
  queryValue.value = "";
});

const getPlaceholder = () => {
  switch (queryType.value) {
    case "address":
      return "请输入地址";
    case "phone":
      return "请输入电话";
    case "name":
      return "请输入姓名";
    case "type":
      return "请输入维护类型";
    case "description":
      return "请输入问题";
    default:
      return "";
  }
};

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  TableQuery.value = true;
  if (queryType.value == "address") {
    queryByLocation(query.pageIndex, query.pageSize);
  } else if (queryType.value == "name") {
    queryByClientName(query.pageIndex, query.pageSize);
  } else if (queryType.value == "phone") {
    queryByPhoneNumber(query.pageIndex, query.pageSize);
  } else if (queryType.value == "type") {
    queryByType(query.pageIndex, query.pageSize);
  } else if ((queryType.value = "description")) {
    queryByDescription(query.pageIndex, query.pageSize);
  }
};
// interface TableItem {
//   id: number;
//   name: string;
//   money: string;
//   state: string;
//   date: string;
//   address: string;
//   thumb: string;
// }

const queryByLocation = (pageIndex: any, pageSize: any) => {
  listByBuildingUnitRoomApi(pageIndex, pageSize, queryValue.value, 1)
    .then((res) => {
      tableData.value = res.data.data.list.map((item: any) => ({
        ...item,
        createTime: formatDate(item.createTime),
        updateTime: formatDate(item.updateTime),
        finishTime: formatDate(item.finishTime),
      }));
      pageTotal.value = res.data.data.total || 50;
      localStorage.setItem(String(query.pageIndex), JSON.stringify(tableData.value));
      // ElMessage.success("查询成功");
    })
    .finally(() => {
      tableLoading.value = false; // 数据加载完成后隐藏 loading 状态
    });
};

const queryByClientName = (pageIndex: any, pageSize: any) => {
  listByClientNameApi(pageIndex, pageSize, queryValue.value, 1)
    .then((res) => {
      tableData.value = res.data.data.list.map((item: any) => ({
        ...item,
        createTime: formatDate(item.createTime),
        updateTime: formatDate(item.updateTime),
        finishTime: formatDate(item.finishTime),
      }));
      pageTotal.value = res.data.data.total || 50;
      localStorage.setItem(String(query.pageIndex), JSON.stringify(tableData.value));
      // ElMessage.success("查询成功");
    })
    .finally(() => {
      tableLoading.value = false; // 数据加载完成后隐藏 loading 状态
    });
};

const queryByPhoneNumber = (pageIndex: any, pageSize: any) => {
  listByPhoneNumberApi(pageIndex, pageSize, queryValue.value, 1)
    .then((res) => {
      tableData.value = res.data.data.list.map((item: any) => ({
        ...item,
        createTime: formatDate(item.createTime),
        updateTime: formatDate(item.updateTime),
        finishTime: formatDate(item.finishTime),
      }));
      pageTotal.value = res.data.data.total || 50;
      localStorage.setItem(String(query.pageIndex), JSON.stringify(tableData.value));
      // ElMessage.success("查询成功");
    })
    .finally(() => {
      tableLoading.value = false; // 数据加载完成后隐藏 loading 状态
    });
};

const queryByType = (pageIndex: any, pageSize: any) => {
  listByMaintTypeApi(pageIndex, pageSize, Number(searchType.value), 1)
    .then((res) => {
      tableData.value = res.data.data.list.map((item: any) => ({
        ...item,
        createTime: formatDate(item.createTime),
        updateTime: formatDate(item.updateTime),
        finishTime: formatDate(item.finishTime),
      }));
      pageTotal.value = res.data.data.total || 50;
      localStorage.setItem(String(query.pageIndex), JSON.stringify(tableData.value));
      // ElMessage.success("查询成功");
    })
    .finally(() => {
      tableLoading.value = false; // 数据加载完成后隐藏 loading 状态
    });
};

const queryByDescription = (pageIndex: any, pageSize: any) => {
  listByDescriptionApi(pageIndex, pageSize, queryValue.value, 1)
    .then((res) => {
      tableData.value = res.data.data.list.map((item: any) => ({
        ...item,
        createTime: formatDate(item.createTime),
        updateTime: formatDate(item.updateTime),
        finishTime: formatDate(item.finishTime),
      }));
      pageTotal.value = res.data.data.total || 50;
      localStorage.setItem(String(query.pageIndex), JSON.stringify(tableData.value));
      // ElMessage.success("查询成功");
    })
    .finally(() => {
      tableLoading.value = false; // 数据加载完成后隐藏 loading 状态
    });
};
export interface FormData {
  id: any;
  clientId: any;
  name: string;
  phone: string;
  building: string;
  unit: string;
  room: string;
  issue: string;
  location: string;
  type: string;
  players: string;
  note: string;
  status: any;
}

const form = reactive<FormData>({
  id: "",
  clientId: "",
  name: "",
  phone: "",
  building: "",
  unit: "",
  room: "",
  issue: "",
  location: "",
  type: "",
  players: "",
  note: "",
  status: "",
});

const resetForm = () => {
  form.name = "";
  form.phone = "";
  form.building = "";
  form.unit = "";
  form.room = "";
  form.issue = "";
  form.location = "";
  form.type = "";
  form.players = "";
  form.note = "";
  form.status = "";
};

interface Building {
  id: number;
  buildingName: string;
  type: number;
  campus: number;
  createTime: string;
  updateTime: string;
  status: number;
}

// 侧边栏折叠
const collapseChage = () => {
  if (sidebar.collapse == false) {
    sidebar.handleCollapse();
  }
};
const userId = ref();
onMounted(() => {
  collapseChage();
  userId.value = localStorage.getItem("user_id");
  let tableDataString = localStorage.getItem(String(query.pageIndex));
  if (tableDataString) {
    tableData.value = JSON.parse(tableDataString);
  }
  getData();
});

const query = reactive({
  address: "",
  name: "",
  pageIndex: 1,
  pageSize: 10,
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(dateString).toLocaleString("zh-CN", options);
};

// 获取表格数据
const getData = () => {
  listUserByStatusAndStateApi(1).then((res) => {
    whPerson.value = res.data.data;
  });

  listMaintTypeByStatusApi(1)
    .then((res) => {
      whType.value = res.data.data;
    })
    .catch((error) => {
      console.error("Error fetching data from API:", error);
    });

  getBuildingListApi(1).then((res) => {
    buildings.value = res.data.data;
    localStorage.setItem("buildings", JSON.stringify(res.data.data));
  });

  tableLoading.value = true; // 开始加载数据时显示 loading 状态

  getFinishWhListApi(query.pageIndex, query.pageSize, 1)
    .then((res) => {
      tableData.value = res.data.data.list.map((item: any) => ({
        ...item,
        createTime: formatDate(item.createTime),
        updateTime: formatDate(item.updateTime),
        finishTime: formatDate(item.finishTime),
      }));
      pageTotal.value = res.data.data.total || 50;
      localStorage.setItem(String(query.pageIndex), JSON.stringify(tableData.value));
    })
    .finally(() => {
      tableLoading.value = false; // 数据加载完成后隐藏 loading 状态
    });
};

// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  let tableDataString = localStorage.getItem(String(query.pageIndex));
  if (tableDataString) {
    tableData.value = JSON.parse(tableDataString);
  }
  tableLoading.value = true;
  if ((TableQuery.value = false)) {
    getData();
  } else if (queryType.value == "address") {
    queryByLocation(query.pageIndex, query.pageSize);
  } else if (queryType.value == "name") {
    queryByClientName(query.pageIndex, query.pageSize);
  } else if (queryType.value == "phone") {
    queryByPhoneNumber(query.pageIndex, query.pageSize);
  } else if (queryType.value == "type") {
    queryByType(query.pageIndex, query.pageSize);
  } else if (queryType.value == "description") {
    queryByDescription(query.pageIndex, query.pageSize);
  }
};

// 删除操作
const handleDelete = (index: number, id: any) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
  }).then(() => {
    // 确保 updateMaintStateApi 返回的是一个 Promise
    updateMaintStateApi(id, 0).then((res) => {
      console.log(res);
      ElMessage.success("删除成功");
      // 从 tableData 中删除项
      tableData.value.splice(index, 1);
      getData();
    });
  });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let idx: number = -1;

const handleEdit = (index: number, row: any) => {
  // 确保 selectedIds 被初始化为数组
  if (!Array.isArray(selectedIds.value)) {
    selectedIds.value = [];
  }

  // 更新表单数据
  form.id = row.id;
  form.clientId = row.clientId;
  form.name = row.clientName;
  form.phone = row.phoneNumber;
  form.building = row.buildingId;
  form.unit = row.unit;
  form.room = row.room;
  form.issue = row.maintDescription;
  form.location = row.locationDescription;
  form.status = 1;
  form.type = row.maintType;
  form.note = row.note;
  // 处理 reporterId，将其转换为数组
  const reporterIds: string[] = row.reporterId
    ? row.completer
      ? row.completer.split(",")
      : []
    : [];

  const numIds: number[] = reporterIds.map((id: string) => Number(id));

  // 重置 selectedIds，避免重复添加
  selectedIds.value.length = 0;
  selectedIds.value.push(...numIds);

  editVisible.value = true;
};

const saveEdit = () => {
  updateMaintRecordApi(
    userId.value,
    form.id, // maintRecordId
    form.clientId,
    form.name, // clientName
    form.phone, // phoneNumber
    Number(form.building), // buildingId
    form.unit, // unit
    form.room, // room
    form.issue, // maintDescription
    form.location, // locationDescription
    selectedIds.value?.join(","), // players (转换为字符串)
    Number(form.type), // 将 form.type 转换为数字
    form.note, // note (你需要确保 form.note 被正确赋值)
    form.status // status (确保 form.status 被正确赋值)
  ).then((res) => {
    getData();
    if (res.data.code == 200) {
      ElMessage.success("修改成功");
    }
    editVisible.value = false;
    resetForm();
    console.log("Update successful");
  });
};

const reset = () => {
  query.pageIndex = 1;
  getData();
  TableQuery.value = false;
  ElMessage.success("重置成功");
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.table {
  font-size: 14px;
}
.modify-input {
  width: 100%;
  height: 35px;
  border-radius: 0.2rem;
}
.form-group .input,
.form-group select,
.form-group textarea {
  font-size: small;
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 0; /* Prevent overflow */
}

.vertical-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: center;
}

.button {
  margin-bottom: 10px; /* 调整按钮之间的间距 */
  width: 30px;
  height: 10px;
}
.button:last-child {
  margin-bottom: 0; /* 移除最后一个按钮的底部间距 */
}

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.red {
  color: #f56c6c;
  margin-left: -1px;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
