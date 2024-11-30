<template>
  <el-table class="table" :data="data">
    <el-table-column prop="buildingName" label="建筑名称"></el-table-column>
    <el-table-column prop="type" label="类型">
      <template #default="scope">
        <span v-if="scope.row.type === 0">办公楼</span>
        <span v-else-if="scope.row.type === 1">职工楼</span>
        <span v-else>未知类型</span>
        <!-- 处理其他情况 -->
      </template>
    </el-table-column>

    <el-table-column prop="campus" label="校区">
      <template #default="scope">
        <span v-if="scope.row.campus === 0">西校区</span>
        <span v-else-if="scope.row.campus === 1">东校区</span>
        <span v-else>未知校区</span>
        <!-- 处理其他情况 -->
      </template>
    </el-table-column>
    <el-table-column label="操作" width="80">
      <template #default="scope">
        <div class="buttons">
          <el-button @click="handleEdit(scope.row)" class="modify-button" size="small">
            修改
          </el-button>
          <el-button @click="handleDelete(scope.row)" class="del-button" type="danger" size="small">
            删除
          </el-button>
        </div>

      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-section">
    <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total"
        :current-page.sync="page.pageNum"
        :page-size="page.pageSize"
        :pager-count="5"
        @current-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import {pageByStatusApi} from "../../../../../api/building";


import {defineEmits, onMounted, ref} from "vue";

const data = ref();

const page = ref({
  pageNum: 1,
  pageSize: 8,
  total: 0,
})

onMounted(() => {
  getData();
})

const getData = () => {
  queryInfo();
}

const queryInfo = () => {
  pageByStatusApi(page.value.pageNum, page.value.pageSize, 1).then(
      res => {
        data.value = res.data.data.list;
        page.value.total = res.data.data.total;
        console.log("res=>", res);
      }
  )
}

const onPageChange = (pageNum: number) => {
  page.value.pageNum = pageNum;
  queryInfo();
  console.log("当前页：", pageNum);
  // queryMaint();
};

const emit = defineEmits(["modify","delete"]);

const handleEdit = (row: any) => {
  emit("modify", row);
}

const handleDelete = (row: any) => {
  emit("delete", row);
};

defineExpose({
  getData
})
</script>

<style scoped>
.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

::v-deep .el-button + .el-button {
  margin: 0 10px;
}

.modify-button {
  background-color: #242f42;
  color: white;
  margin-bottom: 5px;
}

.pagination-section {
  display: flex;
  margin: 20px 0;
  justify-content: center;
}

.del-button {
  background-color: transparent;
  color: red;
}
</style>