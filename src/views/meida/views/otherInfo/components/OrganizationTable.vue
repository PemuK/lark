<template>
  <el-table class="table" :data="data">
    <el-table-column prop="id" label="ID" width="80"></el-table-column>
    <el-table-column prop="organizationName" label="学院"></el-table-column>
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
import {listOrganizationByStatusApi} from "../../../../../api/organization";
import {defineEmits, onMounted, ref} from "vue";

const data = ref();

const emit = defineEmits(["modify","delete"])

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
  listOrganizationByStatusApi(page.value.pageNum, page.value.pageSize, 1).then(
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

.pagination-section {
  display: flex;
  margin: 20px 0;
  justify-content: center;
}

.modify-button {
  background-color: #242f42;
  color: white;
  margin-bottom: 5px;
}

.del-button {
  background-color: transparent;
  color: red;
}

::v-deep .el-button--primary {
  background-color: #242f42;
}

</style>