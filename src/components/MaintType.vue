<template>
  <div style="text-align: right; margin-bottom: 10px">
    <el-button type="primary" @click="AddType">添加</el-button>
  </div>

  <!-- Optimized Table -->
  <el-table :data="maintenanceTypes" style="width: 100%" stripe border>
    <el-table-column
      prop="id"
      label="类型ID"
      width="100"
      align="center"
    ></el-table-column>
    <el-table-column prop="typeName" label="维护类型" align="center"></el-table-column>
    <el-table-column prop="workAmount" label="工作量" align="center"></el-table-column>
    <el-table-column label="操作" width="180" align="center">
      <template #default="scope">
        <el-button @click="typeEdit(scope.row)" type="primary" size="small"
          >修改</el-button
        >
        <el-button @click="typeDelete(scope.row)" type="danger" size="small"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <!-- Optimized Dialog -->
  <el-dialog title="编辑" v-model="typeVisible" width="30%">
    <el-form label-width="90px" label-position="right">
      <el-form-item label="维护类型">
        <el-input v-model="typeForm.name" placeholder="请输入维护类型"></el-input>
      </el-form-item>
      <el-form-item label="工作量">
        <el-input v-model="typeForm.workAmount" placeholder="请输入工作量"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="typeVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTypeEdit()">提交</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Optimized Dialog -->
  <el-dialog title="添加" v-model="addVisible" width="30%">
    <el-form label-width="90px" label-position="right">
      <el-form-item label="维护类型">
        <el-input v-model="typeForm.name" placeholder="请输入维护类型"></el-input>
      </el-form-item>
      <el-form-item label="工作量">
        <el-input v-model="typeForm.workAmount" placeholder="请输入工作量"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="typeVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTypeAdd">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  updateMaintTypeApi,
  listMaintTypeByStatusApi,
  addMaintTypeApi,
  updateMaintTypeStatusApi,
} from "../api/maint";
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';

onMounted(() => {
  getData();
});

const getData = () => {
  listMaintTypeByStatusApi(1).then((res) => {
    if (res.data.code) {
      maintenanceTypes.value = res.data.data;
    }
  });
};

// Tab 2: 维护类型 data
const maintenanceTypes = ref([
  { id: 1, typeName: "硬件维护", workAmount: 10 },
  { id: 2, typeName: "软件维护", workAmount: 20 },
  { id: 3, typeName: "网络维护", workAmount: 15 },
]);

const typeEdit = (row: any) => {
  typeForm.value.id = row.id;
  typeForm.value.name = row.typeName;
  typeForm.value.workAmount = row.workAmount;
  typeVisible.value = true;
};

const typeVisible = ref(false);
const addVisible = ref(false);
const typeForm = ref({
  id: "",
  name: "",
  workAmount: "",
});

const saveTypeEdit = () => {
  updateMaintTypeApi(
    Number(typeForm.value.id),
    typeForm.value.name,
    Number(typeForm.value.workAmount)
  ).then((res) => {
      ElMessage.success("修改成功");
      typeVisible.value = false; // 关闭弹窗
      getData(); // 获取数据
  });
};

const resetForm = () => {
  typeForm.value = {
    id: "",
    name: "",
    workAmount: "",
  };
};

const AddType = () => {
  resetForm();
  addVisible.value = true;
};

const saveTypeAdd = () => {
  addMaintTypeApi(typeForm.value.name, Number(typeForm.value.workAmount)).then((res) => {
    if (res.data.code === 200) {
      ElMessage.success("添加成功");
      resetForm(); // Close dialog and reset form
      getData(); // Refresh data
    }
  });
  addVisible.value = false;
};

const typeDelete = (row: any) => {
  ElMessageBox.confirm(`此操作将删除维护类型 ${row.typeName}，是否继续？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // Update the status to delete (you might define a specific 'deleted' status like 0 or -1)
      updateMaintTypeStatusApi(row.id, 0).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          getData(); // Refresh the list after deletion
        } else {
          ElMessage.error("删除失败，请稍后再试");
        }
      });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
  padding: 10px 0;
}
</style>
