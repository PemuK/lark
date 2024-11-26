<template>
  <el-card class="card" style="margin-top: 20px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          添加维护
          <span style="font-size: 10px; margin-left: 5px; color: #888d8f;">
          </span>
        </div>
        <span style="cursor: pointer; color: #2c2c2c; font-size: small" @click="toPre">返回</span>
      </div>
    </template>
    <el-form
        ref="formRef"
        style="max-width: 600px"
        :model="form"
        label-width="auto"
        class="demo-dynamic"
        @submit.native.prevent="submitForm"
    >
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
              v-model="form.building"
              placeholder="选择所在楼"
              style="height: 35px"
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
              style="height: 40px"
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
              style="height: 40px"
          ></textarea>
        </div>
        <div class="button-container">

          <button type="reset" @click="resetForm()">清空</button>
          <button type="submit">提交</button>
        </div>
      </div>
    </el-form>
  </el-card>
  <el-card class="card" style="margin-top: 5px;">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          联想
          <span style="font-size: 10px; margin-left: 5px; color: #888d8f;">
          </span>
        </div>
        <span style="cursor: pointer; color: #2c2c2c; font-size: small">
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
                <el-icon class="icon"><Location/></el-icon>
              </label>
              <label for="option2">
                <input
                    type="radio"
                    id="option2"
                    name="option"
                    value="2"
                    v-model="option"
                />
                <el-icon class="icon"><User/></el-icon>
              </label>
              <label for="option3">
                <input
                    type="radio"
                    id="option3"
                    name="option"
                    value="3"
                    v-model="option"
                />
                <el-icon class="icon"><Phone/></el-icon>
              </label>
            </div>
          </div>
        </span>
      </div>
    </template>
    <el-table
        id="select"
        :show-header="false"
        :data="associationList"
        v-loading="tableLoading"
        @row-click="clickData"
        style="width: 100%; overflow-y: auto;height: 200px; font-size: 13px"
    >
      <el-table-column width="70">
        <template #default="scope">
          <span>{{ scope.row.clientName }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
                <span
                >{{ scope.row.buildingName }}{{
                    scope.row.unit
                  }}{{ scope.row.room }}</span
                >
        </template>
      </el-table-column>
      <el-table-column width="100" show-overflow-tooltip="true">
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
  </el-card>
</template>

<script setup lang="ts">
import {defineEmits, onMounted, ref, watch} from "vue";
import {getBuildingListApi} from "../../../../api/building";
import {
  addMaintRecordApi,
  listMaintByClientNameApi,
  listMaintByLocationApi,
  listMaintByPhoneNumberApi
} from "../../../../api/maint";
import {ElMessage} from "element-plus";
import {useUserStore} from "../../../../stores/user";

onMounted(() => {
  getData();
})

const emit = defineEmits(["change"]);

const associationList = ref();
const tableLoading = ref(false);
const buildings = ref();
const user=useUserStore();

const option = ref("1")
const form = ref<any>({
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

const toPre = () => {
  emit("change", true);
}

const getData = () => {
  getBuildingListApi().then(res => {
    if (res.data.code == 200) {
      buildings.value = res.data.data;
    }
  })
}

watch(
    () => ({
      option: option.value,
      building: form.value.building,
      unit: form.value.unit,
      room: form.value.room,
      name: form.value.name,
      phone: form.value.phone,
    }),
    (newValues, oldValues) => {
      switch (newValues.option) {
        case "1":
          associationList.value = [];
          tableLoading.value = true;
          newAddress(newValues.building, newValues.unit, newValues.room);
          break;
        case "2":
          associationList.value = [];
          tableLoading.value = true;
          newName(newValues.name);
          break;
        case "3":
          associationList.value = [];
          tableLoading.value = true;
          newPhone(newValues.phone);
          break;
      }
    },
    {deep: true}
);

const newAddress = (building: any, unit: any, room: any) => {
  tableLoading.value = false;
  if (!building) return;
  tableLoading.value = true;
  listMaintByLocationApi(building, unit, room, 1).then((res) => {
    if (res.data.code === 200) {
      associationList.value = res.data.data;
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
      associationList.value = res.data.data;
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
      associationList.value = res.data.data;
      tableLoading.value = false;
    }
  });
};

const clickData = (row: any) => {
  // form.clientId = row.clientId;
  form.value.name = row.clientName;
  form.value.phone = row.phoneNumber;
  form.value.building = row.buildingId;
  form.value.unit = row.unit;
  form.value.room = row.room;
};


const submitForm = (): Promise<void> => {
  // 表单验证
  const isValid = validateForm();

  if (isValid) {
    addMaintRecordApi({
      clientName: form.value.name,
      phoneNumber: form.value.phone,
      unit: form.value.unit,
      room: form.value.room,
      buildingId: form.value.building, // 替换为实际的建筑物 ID 或根据选择的楼名获取
      adderId: user.id, // 替换为实际的添加人员 ID
      maintDescription: form.value.issue,
      locationDescription: form.value.location,
    }).then(res => {
      if (res.data.code == 200) {
        resetForm();
        getData();
        emit("change", true);
        // 显示成功消息
        ElMessage.success("提交成功");
      }
    })
  } else {
    ElMessage.error("内容不合法，请检查并修正");
  }
};

function validateForm(): boolean {
  if (!form.value.name || form.value.name.length === 0) {
    return false;
  }

  if (!form.value.phone || !/^\d{11}$/.test(form.value.phone)) {
    return false;
  }

  if (!form.value.building) {
    return false;
  }

  if (!form.value.room || form.value.room.length === 0) {
    return false;
  }

  if (!form.value.issue || form.value.issue.length === 0) {
    return false;
  }

  return true;
}

const resetForm = () => {
  form.value.name = "";
  form.value.phone = "";
  form.value.building = "";
  form.value.unit = "";
  form.value.room = "";
  form.value.issue = "";
  form.value.location = "";
};
</script>
<style scoped>
.card {
  width: 95%;
  margin: 0 auto;
}

::v-deep .el-card__header {
  padding: 10px;
  font-size: 15px;
}

::v-deep .statistics {
  margin-top: 5px;
  height: 320px;
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
  font-size: 0.75rem;
}

.radio-group label.description {
  margin-left: 12px;
  margin-right: 10px;
}

.radio-options {
  display: flex;
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
  margin-top: 10px; /* Space above the button container */
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

.user-info-list span {
  margin-left: 70px;
}


.action-list li {
  margin-bottom: 10px; /* Space between items */
}

::v-deep .el-card__body {
  padding: 12px;
}
</style>