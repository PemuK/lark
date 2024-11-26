<template>
  <el-dialog
    v-if="props.useDialog"
    v-model="props.dialogFormVisible"
    title="添加维护"
    width="1000"
    @close="dialogClose"
  >
    <el-container>
      <el-main width="40%" id="add">
        <el-form :model="form" @submit.native.prevent="submitForm">
          <div class="form-container">
            <div class="form-group">
              <label for="name">用户姓名</label>
              <input
                id="name"
                class="input"
                v-model="form.name"
                placeholder="输入用户姓名"
              />
            </div>
            <div class="form-group">
              <label for="phone">电话</label>
              <input
                id="phone"
                class="input"
                v-model="form.phone"
                placeholder="输入用户联系电话"
              />
            </div>
            <div class="form-group">
              <label for="building">楼名</label>
              <select
                id="building"
                class="input"
                v-model="selectedBuilding"
                placeholder="选择所在楼"
              >
                <option value="" disabled selected>选择所在楼</option>
                <option
                  v-for="building in buildings"
                  :key="building.id"
                  :value="building.id"
                >
                  {{ building.buildingName }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="unit">单元号</label>
              <input
                id="unit"
                class="input"
                v-model="form.unit"
                placeholder="若无请忽略"
              />
            </div>
            <div class="form-group">
              <label for="room">房间号</label>
              <input
                id="room"
                class="input"
                v-model="form.room"
                placeholder="输入房间号"
              />
            </div>
            <div class="form-group">
              <label for="issue">问题描述</label>
              <textarea
                id="issue"
                class="input"
                v-model="form.issue"
                placeholder="输入问题描述"
                placeholder-class="textarea-placeholder"
                @input=""
              ></textarea>
            </div>
            <div class="form-group">
              <label for="location">地点描述</label>
              <textarea
                id="location"
                class="input"
                v-model="form.location"
                placeholder="输入地点描述"
                placeholder-class="textarea-placeholder"
                @input=""
              ></textarea>
            </div>
            <div class="button-container">
              <button type="submit">提交</button>
              <button type="reset" @click="resetForm()">清空</button>
            </div>
          </div>
        </el-form>
      </el-main>
      <el-aside width="60%">
        <el-container>
          <el-header height="5px">
            <div class="radio-group">
              <label class="description">匹配依据:</label>
              <div class="radio-options">
                <label for="option1">
                  <input
                    type="radio"
                    id="option1"
                    name="option"
                    value="1"
                    checked
                    v-model="option"
                  />
                  <el-icon class="icon"><Location /></el-icon>
                </label>
                <label for="option2">
                  <input
                    type="radio"
                    id="option2"
                    name="option"
                    value="2"
                    v-model="option"
                  />
                  <el-icon class="icon"><User /></el-icon>
                </label>
                <label for="option3">
                  <input
                    type="radio"
                    id="option3"
                    name="option"
                    value="3"
                    v-model="option"
                  />
                  <el-icon class="icon"><Phone /></el-icon>
                </label>
              </div>
            </div>
          </el-header>
          <el-main>
            <el-table
              id="select"
              :show-header="false"
              :data="selectWhList"
              v-loading="tableLoading"
              @row-click="clickData"
              style="width: 100%"
            >
              <el-table-column width="70">
                <template #default="scope">
                  <span>{{ scope.row.clientName }}</span>
                </template>
              </el-table-column>
              <el-table-column>
                <template #default="scope">
                  <span style="font-weight: bold"
                    >{{ scope.row.buildingName }}{{ scope.row.unit
                    }}{{ scope.row.room }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column width="200">
                <template #default="scope">
                  <span>{{ scope.row.maintDescription }}</span>
                </template>
              </el-table-column>
              <el-table-column>
                <template #default="scope">
                  <span>{{ scope.row.phoneNumber }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-aside>
    </el-container>
  </el-dialog>
  <el-container v-else>
    <el-main width="40%" id="add">
      <el-form :model="form" @submit.native.prevent="submitForm">
        <div class="form-container">
          <div class="form-group">
            <label for="name">用户姓名</label>
            <input
              id="name"
              class="input"
              v-model="form.name"
              placeholder="输入用户姓名"
            />
          </div>
          <div class="form-group">
            <label for="phone">电话</label>
            <input
              id="phone"
              class="input"
              v-model="form.phone"
              placeholder="输入用户联系电话"
            />
          </div>
          <div class="form-group">
            <label for="building">楼名</label>
            <select
              id="building"
              class="input"
              v-model="selectedBuilding"
              placeholder="选择所在楼"
            >
              <option value="" disabled selected>选择所在楼</option>
              <option
                v-for="building in buildings"
                :key="building.id"
                :value="building.id"
              >
                {{ building.buildingName }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="unit">单元号</label>
            <input id="unit" class="input" v-model="form.unit" placeholder="若无请忽略" />
          </div>
          <div class="form-group">
            <label for="room">房间号</label>
            <input id="room" class="input" v-model="form.room" placeholder="输入房间号" />
          </div>
          <div class="form-group">
            <label for="issue">问题描述</label>
            <textarea
              id="issue"
              class="input"
              v-model="form.issue"
              placeholder="输入问题描述"
              placeholder-class="textarea-placeholder"
              @input=""
            ></textarea>
          </div>
          <div class="form-group">
            <label for="location">地点描述</label>
            <textarea
              id="location"
              class="input"
              v-model="form.location"
              placeholder="输入地点描述"
              placeholder-class="textarea-placeholder"
              @input=""
            ></textarea>
          </div>
          <div class="button-container">
            <button type="submit">提交</button>
            <button type="reset" @click="resetForm()">清空</button>
          </div>
        </div>
      </el-form>
    </el-main>
    <el-aside width="60%">
      <el-container>
        <el-header height="5px">
          <div class="radio-group">
            <label class="description">匹配依据:</label>
            <div class="radio-options">
              <label for="option1">
                <input
                  type="radio"
                  id="option1"
                  name="option"
                  value="1"
                  checked
                  v-model="option"
                />
                <el-icon class="icon"><Location /></el-icon>
              </label>
              <label for="option2">
                <input
                  type="radio"
                  id="option2"
                  name="option"
                  value="2"
                  v-model="option"
                />
                <el-icon class="icon"><User /></el-icon>
              </label>
              <label for="option3">
                <input
                  type="radio"
                  id="option3"
                  name="option"
                  value="3"
                  v-model="option"
                />
                <el-icon class="icon"><Phone /></el-icon>
              </label>
            </div>
          </div>
        </el-header>
        <el-main>
          <el-table
            id="select"
            :show-header="false"
            :data="selectWhList"
            v-loading="tableLoading"
            @row-click="clickData"
            style="width: 100%"
          >
            <el-table-column width="70">
              <template #default="scope">
                <span>{{ scope.row.clientName }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <span style="font-weight: bold"
                  >{{ scope.row.buildingName }}{{ scope.row.unit
                  }}{{ scope.row.room }}</span
                >
              </template>
            </el-table-column>
            <el-table-column width="200">
              <template #default="scope">
                <span>{{ scope.row.maintDescription }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <span>{{ scope.row.phoneNumber }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { getBuildingListApi } from "../api/building";
import { ElMessage } from "element-plus";

import {
  addMaintRecordApi,
  listMaintByClientNameApi,
  listMaintByLocationApi,
  listMaintByPhoneNumberApi,
} from "../api/maint";
const emit = defineEmits<{
  (e: "update:dialogFormVisible", value: boolean): void;
  (e: "custom-event", payload: any): void;
}>();
const id = localStorage.getItem("user_id");
const option = ref("1");
const tableLoading = ref(false);
const router = useRouter();
const props = defineProps({
  useDialog: {
    type: Boolean,
    default: true,
  },
  dialogFormVisible: {
    type: Boolean,
    default: false,
  },
});

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

const selectWhList = ref([]);
const selectedBuilding = ref<number>(0);
const buildings = ref<Building[]>([]);

const form = reactive<any>({
  id: "",
  clientId: "",
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

const close = () => {
  emit("update:dialogFormVisible", false);
};

onMounted(() => {
  try {
    const buildingString = localStorage.getItem("buildings");

    if (buildingString) {
      buildings.value = JSON.parse(buildingString);
    } else {
      console.warn("buildings is null or undefined");
    }
  } catch (error) {
    console.log("Error parsing JSON from localStorage:", error);
  }

  getData();
});

const getData = () => {
  getBuildingListApi(1).then((res) => {
    if (res.data.code == 200) {
      buildings.value = res.data.data;
      localStorage.setItem("buildings", JSON.stringify(res.data.data));
    }
  });
};

const dialogClose = () => {
  resetForm();
  emit("custom-event", { message: false });
  selectWhList.value = [];
};

const submitForm = async (): Promise<void> => {
  // 表单验证
  const isValid = validateForm();

  if (true) {
    try {
      // 调用后端 API 提交表单数据
      const response = await addMaintRecordApi({
        clientName: form.name,
        phoneNumber: form.phone,
        unit: form.unit,
        room: form.room,
        buildingId: selectedBuilding.value, // 替换为实际的建筑物 ID 或根据选择的楼名获取
        adderId: Number(id), // 替换为实际的添加人员 ID
        maintDescription: form.issue,
        locationDescription: form.location,
      });
      // 提交成功后的处理逻辑，例如清空表单
      resetForm();
      getData();
      emit("custom-event", { message: false });
      // 显示成功消息
      ElMessage.success("提交成功");
    } catch (error) {
      console.log(error);
      ElMessage.error("提交失败，请重试");
    }
  } else {
    ElMessage.error("内容不合法，请检查并修正");
  }
  if (props.useDialog) {
    router.push("/dashboard");
  }
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

watch(
  () => ({
    option: option.value,
    building: selectedBuilding.value,
    unit: form.unit,
    room: form.room,
    name: form.name,
    phone: form.phone,
  }),
  (newValues, oldValues) => {
    switch (newValues.option) {
      case "1":
        selectWhList.value = [];
        tableLoading.value = true;
        newAddress(newValues.building, newValues.unit, newValues.room);

        break;
      case "2":
        selectWhList.value = [];

        tableLoading.value = true;
        newName(newValues.name);
        break;
      case "3":
        selectWhList.value = [];
        tableLoading.value = true;
        newPhone(newValues.phone);
        break;
    }
  },
  { deep: true }
);

const newAddress = (building: any, unit: any, room: any) => {
  tableLoading.value = false;
  if (building === 0) return;
  tableLoading.value = true;
  listMaintByLocationApi(building, unit, room, 1).then((res) => {
    if (res.data.code === 200) {
      selectWhList.value = res.data.data;
      tableLoading.value = false;
    }
  });
};

const newName = (name: string) => {
  tableLoading.value = false;
  if (name === "") return;
  tableLoading.value = true;
  listMaintByClientNameApi(name, 1).then((res) => {
    if (res.data.code === 200) {
      selectWhList.value = res.data.data;
      tableLoading.value = false;
    }
  });
};

const newPhone = (phone: string) => {
  tableLoading.value = false;
  if (phone === "") return;
  tableLoading.value = true;
  listMaintByPhoneNumberApi(phone, 1).then((res) => {
    if (res.data.code === 200) {
      selectWhList.value = res.data.data;
      tableLoading.value = false;
    }
  });
};

const clickData = (row:any) => {
  // form.clientId = row.clientId;
  form.name = row.clientName;
  form.phone = row.phoneNumber;
  selectedBuilding.value = row.buildingId;
  form.unit = row.unit;
  form.room = row.room;
};
</script>

<style scoped>
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
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
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
  margin-left: 70px;
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

.el-dialog {
  --el-dialog-width: 50%;
  --el-dialog-margin-top: 15vh;
  --el-dialog-bg-color: var(--el-bg-color);
  --el-dialog-box-shadow: var(--el-box-shadow);
  --el-dialog-title-font-size: var(--el-font-size-large);
  --el-dialog-content-font-size: 14px;
  --el-dialog-font-line-height: var(--el-font-line-height-primary);
  --el-dialog-padding-primary: 16px;
  --el-dialog-border-radius: var(--el-border-radius-small);
  background: var(--el-dialog-bg-color);
  border-radius: var(--el-dialog-border-radius);
  box-shadow: var(--el-dialog-box-shadow);
  box-sizing: border-box;
  margin: var(--el-dialog-margin-top, 15vh) auto 50px;
  overflow-wrap: break-word;
  padding: var(--el-dialog-padding-primary);
  position: relative;
  width: 1000px;
}

.action-button:hover {
  color: #0056b3; /* Darker background on hover */
}

#select {
  overflow-y: auto;
  height: 455px;
}
</style>
