<template>
  <el-card class="card">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          信息管理
        </div>
        <el-dropdown ref="dropdownRef" @command="handleCommand">
          <span class="option">
            当前：{{ optionLabel || '请选择' }}
            <el-icon><arrow-down/></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1">部门</el-dropdown-item>
              <el-dropdown-item command="2">维护类型</el-dropdown-item>
              <el-dropdown-item command="4">建筑</el-dropdown-item>
              <div class="break" @click="addInfo">添加当前信息</div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <Transition name="run" appear>
      <div v-if="option=='1'">
        <OrganizationTable ref="organization" @modify="modify" @delete="deleteInfo"/>
      </div>
      <div v-else-if="option=='2'">
        <MaintTypeTable ref="maintType" @modify="modify" @delete="deleteInfo"/>
      </div>
      <div v-else-if="option=='3'">
        <DNSTable @modify="modify" @delete="deleteInfo"/>
      </div>
      <div v-else-if="option=='4'">
        <BuildingTable ref="building" @modify="modify" @delete="deleteInfo"/>
      </div>
    </Transition>
  </el-card>
  <el-dialog v-model="visible" v-if="visible" :width="300">
    <ActionDialog :option="option" :action="action" :info="info" @close="closeDialog"/>
  </el-dialog>
</template>

<script setup lang="ts">
import OrganizationTable from "./components/OrganizationTable.vue";
import {ArrowDown} from "@element-plus/icons-vue";
import {computed, onMounted, ref, watch} from "vue";
import MaintTypeTable from "./components/MaintTypeTable.vue";
import DNSTable from "./components/DNSTable.vue";
import BuildingTable from "./components/BuildingTable.vue";
import ActionDialog from "./components/ActionDialog.vue";

const option = ref<string | null>("1");
const organization = ref();
const maintType = ref();
const building = ref();

// 将 option 值存储到 localStorage
const saveOptionToLocalStorage = () => {
  localStorage.setItem("option", option.value);
};

// 从 localStorage 获取 option 值
const loadOptionFromLocalStorage = () => {
  const storedOption = localStorage.getItem("option");
  if (storedOption !== null) {
    option.value = storedOption;
  }
};

const action = ref(1);

const info = ref("");

const optionLabels: Record<string, string> = {
  "1": "部门",
  "2": "维护类型",
  "3": "DNS",
  "4": "建筑"
};

const optionLabel = computed(() => option.value ? optionLabels[option.value] : null);

const visible = ref(false);

const addInfo = () => {
  action.value = 2;
  visible.value = true;
}

const modify = (msg: any) => {
  info.value = msg;
  action.value = 0;
  console.log(info.value);
  visible.value = true;
}

const deleteInfo = (msg: any) => {
  info.value = msg;
  action.value = 1;
  visible.value = true;
}

const handleCommand = (value: string) => {
  option.value = value;
}

const closeDialog = () => {
  visible.value = false;
  getData();
}

const getData = () => {
  if (option.value == '1') {

    organization.value.getData();
  } else if (option.value == '2') {

    maintType.value.getData();
  } else if (option.value == '4') {

    building.value.getData();
  }
}


onMounted(() => {
  // 组件挂载后再次确保 option 值被加载
  loadOptionFromLocalStorage();
});

watch(option, (newValue) => {
  saveOptionToLocalStorage();
});
</script>

<style scoped>
.card {
  width: 95%;
  margin: 20px auto 0;
  min-height: 730px;
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

.break {
  border-top: 1px solid #ddd; /* 添加底部横线 */
  font-size: 12px;
  padding-top: 5px;
  padding-right: 15px;
  padding-left: 15px;
  color: #242f42;
}
</style>