<template>
  <el-card class="card">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          IP分配
          <span style="font-size: 10px; margin-left: 5px; color: #888d8f;">
              (点击每行分配详细详细)
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
                <el-dropdown-item command="1">姓名</el-dropdown-item>
                <el-dropdown-item command="2">电话</el-dropdown-item>
                <el-dropdown-item command="3">账号</el-dropdown-item>
                <el-dropdown-item command="4">部门</el-dropdown-item>
                <el-dropdown-item command="5">权限</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown></span>
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
      <el-table-column label="部门" prop="name" />
      <el-table-column label="学院/部门" prop="organizationName" />
      <el-table-column label="账号" prop="username" />
      <el-table-column label="权限" prop="permission" />
      <el-table-column label="联系电话" prop="phoneNumber" />
      <el-table-column label="年级" prop="startYear" />
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
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {ArrowDown} from "@element-plus/icons-vue";
//查询依据
const option = ref<string | null>("1");
const searchInput = ref();
const tableLoading=ref(false);
const tableData=ref();
const optionLabel = computed(() => option.value ? optionLabels[option.value] : null);
const optionLabels: Record<string, string> = {
  "1": "姓名",
  "2": "电话",
  "3": "账号",
  "4": "部门",
  "5": "权限"
};

const page = ref({
  currentPage: 1,
  pageSize: 8,
  totalItems: 0
});

const handleCommand = (value: string) => {
  option.value = value;
  searchInput.value = "";
  queryMaint();
};
const getPlaceholder = () => {
  if (option.value) {
    if (option.value === "1") {
      return "请输入姓名";
    } else if (option.value === "2") {
      return "请输入电话";
    } else if (option.value === "3") {
      return "输入账号";
    } else if (option.value == "4") {
      return "输入部门";
    } else if (option.value == "5") {
      return "权限";
    }
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