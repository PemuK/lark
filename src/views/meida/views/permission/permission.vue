<template>
  <el-card class="card">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          权限管理
        </div>
        <span class="option">
             <el-icon><Plus/></el-icon>
        </span>
      </div>
    </template>
    <el-space direction="vertical" class="space" style="width: 100%;">
      <el-card
          v-for="(group, i) in groups"
          :key="i"
          class="group-card"
      >
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="group-title">{{ group.groupName }}</span>
            </div>
            <span class="option">
             修改
            </span>
          </div>
        </template>
        <div class="text-item ellipsis">
          具有权限：
          <span v-for="(permission, o) in group.permissions">
             {{ permission.permissionName }}&nbsp;&nbsp;
          </span>
          <el-tooltip/>
        </div>
        <div class="text-item ellipsis">
          成员：
          <span v-for="(user, o) in group.users" :key="`user-${o}`">
          {{ user.name }}&nbsp;&nbsp;
          </span>
        </div>
      </el-card>
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
import {listByStatus} from "../../../../api/group";
import {onMounted, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";

const groups = ref();

onMounted(() => {
  getData();
})

const getData = () => {
  listByStatus(1).then(res => {
    if (res.data.code == 200) {
      groups.value = res.data.data;
    }
  })
}

</script>
<style scoped>

.group-card {

}

.space {
  width: 100%;
}

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

::v-deep .el-space__item {
  width: 100%;
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

.group-title {
  font-weight: bold;
  font-size: 16px;
}

.text-item {
  padding: 8px;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.text-item:last-child {
  border-bottom: none;
}

</style>