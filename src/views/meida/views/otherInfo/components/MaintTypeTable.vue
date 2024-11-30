<template>
  <el-table class="table" :data="data">
    <el-table-column
        prop="id"
        label="类型ID"
        width="100"
        align="center"
    ></el-table-column>
    <el-table-column prop="typeName" label="维护类型" align="center"></el-table-column>
    <el-table-column prop="workAmount" label="工作量" align="center"></el-table-column>
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
<!--  <div class="pagination-section">-->
<!--    <el-pagination-->
<!--        background-->
<!--        layout="prev, pager, next"-->
<!--        :total="page.total"-->
<!--        :current-page.sync="page.pageNum"-->
<!--        :page-size="page.pageSize"-->
<!--        :pager-count="5"-->
<!--        @current-change="onPageChange"-->
<!--    />-->
<!--  </div>-->
</template>

<script setup lang="ts">
import {listMaintTypeByStatusApi} from "../../../../../api/maint";

import {onMounted, ref,defineEmits,defineExpose} from "vue";

const data = ref();

const emit = defineEmits(["modify","delete"]);

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
  listMaintTypeByStatusApi(1).then(
      res => {
        data.value = res.data.data;
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