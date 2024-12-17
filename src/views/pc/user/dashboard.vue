<template>
  <div>
    <el-row :gutter="10">
      <!-- 调整gutter -->
      <el-col :span="6">
        <!-- 调整左边列宽 -->
        <el-card shadow="hover" class="mgb20" style="height: 13vh">
          <!-- 减少外边距 -->
          <div class="user-info">
            <div class="user-info-cont">
              <div class="user-info-name">{{ user.name }}</div>
              <div id="info">
                <span>账号：{{ user.username }}</span
                ><br />
                <span v-if="user.startYear">{{ user.startYear }}级</span>
                <span>权限: {{ user.permission }}</span>
                <div>部门: {{ user.organizationName }}</div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="mgb20" style="height: 40vh; overflow-y: auto">
          <!-- 减少外边距 -->
          <template #header>
            <div class="clearfix">
              <span
                >{{ nowTime.getFullYear() }}年{{
                  nowTime.getMonth() + 1
                }}月工作量统计</span
              >
            </div>
          </template>
          <Statistic ref="childRef1"></Statistic>
        </el-card>
        <el-card class="mgb20" style="height: 27vh">
          <Chart ref="childRef" />
          <!-- <div ref="chartRef" style="width: 100%; height: 23vh"></div> -->
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="hover" style="height: 80vh; padding: 10px">
          <template #header>
            <div class="clearfix">
              <span v-if="!change">未完成维护记录</span>
              <span v-else>添加维护</span>
              <div id="button-contianer" v-if="permissStore.key.includes('3')">
                <el-button
                  v-if="!change"
                  style="float: right; padding: 3px 0"
                  text
                  @click="addWh"
                  >添加</el-button
                >

                <el-button v-else style="float: right; padding: 3px 0" text @click="addWh"
                  >返回</el-button
                >
              </div>
            </div>
          </template>
          <div v-if="!change">
            <el-table
              :show-header="false"
              :data="whList"
              style="width: 100%"
              :border="false"
            >
              <el-table-column
                min-width="18%"
                :label="'Address'"
                class-name="address-column"
             
              >  <!--@click="searchByAddress"--> 
                <template #default="scope">
                  <span
                    >{{ scope.row.buildingName }}{{ scope.row.unit
                    }}{{ scope.row.room }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                min-width="15%"
                :label="'Phone Number'"
                class-name="phone-number-column"
              >
                <template #default="scope">
                  <span>{{ scope.row.phoneNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="9.5%"
                :label="'Client Name'"
                class-name="client-name-column"
              >
                <template #default="scope">
                  <span style="font-weight: bold">{{ scope.row.clientName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="40%"
                :label="'Maintenance Description'"
                class-name="maintenance-description-column"
              >
                <template #default="scope">
                  <span>{{ scope.row.maintDescription }}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                :label="'Location Description'"
                class-name="location-description-column"
              >
                <template #default="scope">
                  <span>{{ scope.row.locationDescription }}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="13%"
                :label="'Create Time'"
                class-name="create-time-column"
              >
                <template #default="scope">
                  <span>{{ formatDate(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="7%"
                :label="'Create Time'"
                class-name="create-time-column"
              >
                <template #default="scope">
                  <span>{{ scope.row.adderName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="6%"
                :label="'Actions'"
                class-name="actions-column"
              >
                <template #default="scope">
                  <el-popover
                    placement="top-start"
                    :width="50"
                    trigger="hover"
                    class="customPopper"
                  >
                    <template #reference>
                      <svg
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M512 256a64 64 0 1 0 0-128 64 64 0 0 0 0 128zM512 576a64 64 0 1 0 0-128 64 64 0 0 0 0 128zM576 832a64 64 0 1 1-128 0 64 64 0 0 1 128 0z"
                          fill="#000000"
                          fill-opacity=".9"
                        ></path>
                      </svg>
                    </template>
                    <template #default>
                      <div class="popover-content">
                        <ul class="action-list">
                          <li>
                            <button class="action-button" @click="del(scope.row.id)">
                              删除
                            </button>
                          </li>
                          <li>
                            <button class="action-button" @click="modify(scope.row.id)">
                              修改
                            </button>
                          </li>
                          <li>
                            <button class="action-button" @click="report(scope.row.id)">
                              填报
                            </button>
                          </li>
                        </ul>
                      </div>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div id="add-list" v-else>
            <AddModal :useDialog="false" @custom-event="closeDialog"></AddModal>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <!-- 编辑弹出框 -->
  <el-dialog title="编辑" v-model="editVisible" width="30%" @close="reset()">
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">提交</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="填报" v-model="reportVisible" width="30%" @close="">
    <el-form label-width="70px">
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
        <el-select v-model="selectedType" placeholder="请选择类型" size="small">
          <el-option
            v-for="type in whType"
            :key="type.id"
            :label="type.typeName"
            :value="type.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="解决方案">
        <el-input type="textarea" v-model="note"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="reportVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveReport">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="dashboard">
import Statistic from "../../../components/statistics.vue";
import Chart from "../../../components/chart.vue";

import { reactive, onMounted } from "vue";
import { usePermissStore } from "../../../stores/permiss";
import AddModal from "../../../components/AddModal.vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";

import { listWorkAmountByMonthApi } from "../../../api/work-amount";
import { listUserByStatusAndStateApi } from "../../../api/user";
import { getBuildingListApi } from "../../../api/building";
import {
  getUnFinishWhListApi,
  updateMaintStateApi,
  updateMaintRecordApi,
  listMaintTypeByStatusApi,
  reportMaintApi,
} from "../../../api/maint";

import { useUserStore } from "../../../stores/user";
export interface FormData {
  id: string;
  name: string;
  phone: string;
  building: string;
  unit: string;
  room: string;
  issue: string;
  location: string;
}

interface Building {
  id: number;
  buildingName: string;
  type: number;
  campus: number;
  createTime: string;
  updateTime: string;
  status: number;
}
const permissStore = usePermissStore();
const id = localStorage.getItem("user_id");
const name = localStorage.getItem("ms_username");
const userTotal = ref(0);
const user = useUserStore();
const userBindTotal = ref(0);
const whList = ref<any[]>([]);
const whPerson = ref<any[]>([]);
const whType = ref<any[]>([]);
const nowTime = new Date();
const change = ref(false);
const reportId = ref();
const selectedBuilding = ref<number>(0);
const buildings = ref<Building[]>([]);
const editVisible = ref(false);
const reportVisible = ref(false);
const selectedIds = ref<number[]>([Number(id)]);
const selectedType = ref();
const note = ref();
const childRef = ref<any>(null);
const childRef1 = ref<any>(null);
const form = reactive<any>({
  id: "",
  name: "",
  phone: "",
  building: "",
  unit: "",
  room: "",
  issue: "",
  location: "",
});

const resetForm = () => {
  form.name = "";
  form.phone = "";
  form.building = "";
  form.unit = "";
  form.room = "";
  form.issue = "";
  form.location = "";
};
const reset = () => {
  resetForm();
};

const closeDialog = () => {
  change.value = false;
  getData();
};
onMounted(() => {
  // 获取 localStorage 中的 'Whlist' 和 'buildings'
  const whListString = localStorage.getItem("Whlist");
  const buildingString = localStorage.getItem("buildings");

  // 获取数据
  getData();

  // 如果 'Whlist' 存在，尝试解析 JSON
  if (whListString) {
    try {
      whList.value = JSON.parse(whListString);
    } catch (error) {
      whList.value = []; // 解析失败时，设置一个默认值
    }
  }

  // 如果 'buildings' 存在，尝试解析 JSON
  if (buildingString) {
    try {
      buildings.value = JSON.parse(buildingString);
    } catch (error) {
      buildings.value = []; // 解析失败时，设置一个默认值
    }
  }
});

const getData = () => {
  listUserByStatusAndStateApi(1, 1).then((res) => {
    if (res.data.code == 200) {
      whPerson.value = res.data.data;
    }
  });
  listMaintTypeByStatusApi(1).then((res) => {
    if (res.data.code == 200) {
      whType.value = res.data.data;
    }
  });
  getUnFinishWhListApi(1).then((res) => {
    if (res.data.code == 200) {
      whList.value = res.data.data;
      localStorage.setItem("Whlist", JSON.stringify(res.data.list));
    }
  });

  getBuildingListApi(1).then((res) => {
    if (res.data.code == 200) {
      buildings.value = res.data.data;
      localStorage.setItem("buildings", JSON.stringify(res.data.data));
    }
  });
};

const addWh = () => {
  if (change.value === false) {
    change.value = true;
  } else {
    change.value = false;
  }
};

const del = (id: any) => {
  updateMaintStateApi(id, 0).then((res) => {
    ElMessage.success("删除成功");
    const updatedList = whList.value.filter((item) => item.id !== id);
    whList.value = updatedList;
  });
};

const modify = (id: any) => {
  editVisible.value = true;
  const item = whList.value.find((item) => item.id === id);
  if (item) {
    form.id = item.id;
    form.clientId = item.clientId;
    form.name = item.clientName;
    form.phone = item.phoneNumber;
    form.building = item.buildingId;
    form.unit = item.unit;
    form.room = item.room;
    form.issue = item.maintDescription;
    form.location = item.locationDescription;
  }
};

const report = (id: any) => {
  reportVisible.value = true;
  reportId.value = id;
};

const saveReport = () => {
  console.log(selectedIds.value);
  reportMaintApi(
    reportId.value,
    user.id,
    selectedIds.value.join(","),
    selectedType.value,
    note.value
  ).then((res) => {
    if (res.data.code == 200) {
      ElMessage.success("填报成功");
      getData();
      if (childRef.value && childRef1.value) {
        childRef.value.getData();
        childRef1.value.getData();
      }
      reportVisible.value = false;
    }
  });
};

const saveEdit = () => {
  updateMaintRecordApi(
    user.id,
    form.id, // maintRecordId
    form.clientId,
    form.name, // clientName
    form.phone, // phoneNumber
    form.building, // buildingId
    form.unit, // unit
    form.room, // room
    form.issue, // maintDescription
    form.location // locationDescription
  ).then((res) => {
    getData();
    ElMessage.success("修改成功");
    editVisible.value = false;
    resetForm();
  });
};

const formatDate = (timestamp: any) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // 可以根据需要使用其他格式化方法
};

function validateForm(): boolean {
  if (!form.name || form.name.length === 0) {
    return false;
  }

  if (!form.phone || !/^\d{11}$/.test(form.phone)) {
    return false;
  }

  if (!selectedBuilding.value) {
    return false;
  }

  if (!form.room || form.room.length === 0) {
    return false;
  }

  if (!form.issue || form.issue.length === 0) {
    return false;
  }

  return true;
}

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

<style lang="scss">
.el-popper,
.is-light,
.el-popover {
  min-width: 100px !important;
  padding: -20px;
}
</style>

<style scoped>
#work-amount {
  overflow-y: auto;
}

.icon {
  padding-top: 2.3px;
  color: rgb(141, 141, 141);
}

/* 选中时的样式 */
input[type="radio"]:checked + .icon {
  color: #000000; /* 黑色 */
}

.radio-group {
  display: flex;
  align-items: left;
  font-size: 0.75rem;
}
.radio-group label.description {
  margin-left: 12px;
  margin-right: 10px;
}
.radio-options {
  display: flex;
  width: 100px;
  gap: 10px; /* 增加选项之间的间距 */
}

.radio-options input[type="radio"] {
  opacity: 0;
  position: absolute;
  left: -9999px;
}

.radio-options label {
  display: flex;
  align-items: center;
  gap: 5px; /* 增加标签和单选框之间的间距 */
}
.modify-input {
  width: 100%;
}
#add {
  display: flex;
  justify-content: center;
  border-right: 1px solid rgb(65, 65, 65, 0.2); /* Add vertical line */
  height: 510px;
}
body {
  font-family: Arial, sans-serif;
}
.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* padding: 10px; */
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  margin-left: -55px;
  flex-wrap: wrap; /* Ensure labels and inputs wrap on smaller screens */
}

.form-group label {
  width: 30%;
  font-size: small;
  margin-right: 10px;
  text-align: right;
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

#add-list {
  margin: 0 auto;
}

.form-group textarea {
  resize: vertical;
  height: 60px; /* Adjust height as needed */
}

.button-container {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  gap: 10px; /* Space between buttons */
  margin-top: 30px; /* Space above the button container */
}

.button-container button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #262626;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-container button:hover {
  background-color: #000000;
}

/* 原生 input 元素的样式 */
form {
  display: flex;
  flex-direction: column; /* 竖直排列子元素 */
}

#button-contianer {
  position: relative;
  top: -23px;
}

select {
  width: 300px;
  height: 34px;
  border: 2px solid rgb(226, 224, 224);
  border-radius: 5px;
  text-decoration: none;
  box-shadow: none; /* 去除阴影 */
  background: none; /* 去除背景 */
  outline: none; /* 去除焦点时的轮廓 */
  padding: 2px; /* 内边距 */
  font-size: 14px; /* 自定义字体大小 */
  color: #000000; /* 自定义字体颜色 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

option {
  transition: all 0.3s ease; /* 添加过渡效果 */
}

/* 鼠标悬停时的效果 */
select:hover {
  border: 2px solid #8e8e8e; /* 自定义悬停边框颜色 */
}

/* 聚焦时的效果 */
select:focus {
  border: 2px solid #525252; /* 自定义焦点边框颜色 */
  outline: none; /* 去除默认焦点轮廓 */
}

#info {
  margin-left: 3px;
}

input {
  width: 200px;
  height: 10px;
  border: 2px solid rgb(226, 224, 224);
  border-radius: 5px;
  text-decoration: none;
  box-shadow: none; /* 去除阴影 */
  background: none; /* 去除背景 */
  outline: none; /* 去除焦点时的轮廓 */
  padding: 2px; /* 内边距 */
  font-size: 14px; /* 自定义字体大小 */
  color: #000000; /* 自定义字体颜色 */
}

input:focus {
  border: 2px solid #525252; /* 自定义焦点边框颜色 */
}

input:hover {
  border: 2px solid #8e8e8e; /* 自定义悬停边框颜色 */
}

div {
  user-select: none;
}

.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  margin-top: auto; /* 推到父容器底部 */
  margin-bottom: 20px; /* 可以保留底部外边距 */
}

.user-info-cont {
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 20px;
  color: #222;
  margin-bottom: 5px;
  font-weight: bold;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 10px;
}

.mgb20 {
  margin-bottom: 10px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.popover-content {
  width: 100%; /* Ensure the popover takes full width */
  text-align: center; /* Center text */
  box-sizing: border-box; /* Include padding and border in width calculation */
}

.action-list {
  list-style: none; /* Remove bullet points */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
  width: 100%; /* Ensure list takes full width */
}

.action-list li {
  margin-bottom: 10px; /* Space between items */
}

.action-button {
  display: block; /* Make buttons take full width */
  width: 100%; /* Full width */
  border: none; /* Remove default border */
  color: black; /* Button text color */
  background-color: transparent; /* Transparent background */
  font-size: 14px; /* Font size */
  text-align: center; /* Center text */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s; /* Smooth background color transition */
  box-sizing: border-box; /* Include padding and border in width calculation */
}

.action-button:hover {
  color: #0056b3; /* Darker background on hover */
}

.user-info-name {
  font-size: 2rem;
}
</style>
