<template>
  <div>
    <!-- 搜索框 -->

    <div class="box">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="请输入学院以搜索"
          prefix-icon="el-icon-search"
          clearable
          style="width: 300px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
        <el-button type="primary" @click="reset"> 重置 </el-button>
      </div>

      <!-- 添加按钮 -->
      <div class="add">
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="addressData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="organizationName" label="学院"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="primary" size="small"
            >修改</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="typeVisible" width="30%">
      <el-form label-width="90px" label-position="right">
        <el-form-item label="学院名称">
          <el-input
            v-model="typeForm.organizationName"
            placeholder="请输入学院名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="typeVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加" v-model="addVisible" width="30%">
      <el-form label-width="90px" label-position="right">
        <el-form-item label="学院名称">
          <el-input
            v-model="addForm.organizationName"
            placeholder="请输入学院名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAdd">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  listOrganizationByStatusApi,
  addOrganizationApi,
  updateOrganizationNameApi,
  updateOrganizationStatusApi,
  pageByNameApi,
} from "../api/organization";
import { ElMessage, ElMessageBox } from "element-plus";

const pageSize = 14;
const pageNum = ref(1);
const total = ref(0);

const addressData = ref<any[]>([]);
const searchQuery = ref("");
const searchType = ref(false);
const typeVisible = ref(false);
const addVisible = ref(false);

const typeForm = ref({
  id: "",
  organizationName: "",
});

const addForm = ref({
  organizationName: "",
});

onMounted(() => {
  getData(pageNum.value);
});

// Handle Search
const handleSearch = async () => {
  pageNum.value = 1;
  searchType.value = true;
  searchData(pageNum.value);
};
const reset = () => {
  searchQuery.value = "";
  pageNum.value = 1;
  searchType.value = false;
  getData(pageNum.value);
};

const getData = (currentPage: number) => {
  listOrganizationByStatusApi(currentPage, pageSize).then((res) => {
    if (res.data.code === 200) {
      addressData.value = res.data.data.list;
      total.value = res.data.data.total;
    }
  });
};

const searchData = (currentPage: number) => {
  pageByNameApi(currentPage, pageSize, searchQuery.value, 1).then((res) => {
    if (res.data.code === 200) {
      addressData.value = res.data.data.list;
      total.value = res.data.data.total; // Update total for pagination
      ElMessage.success("查询成功");
    } else {
      ElMessage.error("获取建筑列表失败");
    }
  });
};

// Handle Page Change
const handlePageChange = (newPage: number) => {
  pageNum.value = newPage;
  if ((searchType.value = true)) {
    searchData(newPage);
  } else {
    getData(newPage);
  }
};

// Handle Edit
const handleEdit = (row: any) => {
  typeForm.value.id = row.id;
  typeForm.value.organizationName = row.organizationName;
  typeVisible.value = true;
};

// Save Edit
const saveEdit = () => {
  updateOrganizationNameApi(Number(typeForm.value.id), typeForm.value.organizationName)
    .then((res) => {
      if (res.data.code === 200) {
        ElMessage.success("修改成功");
        typeVisible.value = false;
        getData(pageNum.value);
      } else {
        ElMessage.error("修改失败");
      }
    })
    .catch(() => {
      ElMessage.error("编辑失败，请稍后再试");
    });
};

// Handle Delete
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.organizationName} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      updateOrganizationStatusApi(row.id, 0).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          getData(pageNum.value);
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// Handle Add
const handleAdd = () => {
  addForm.value.organizationName = ""; // Clear the form for new input
  addVisible.value = true;
};

// Save Add
const saveAdd = () => {
  if (!addForm.value.organizationName.trim()) {
    ElMessage.error("学院名称不能为空");
    return;
  }

  addOrganizationApi(addForm.value.organizationName)
    .then((res) => {
      if (res.data.code === 200) {
        ElMessage.success("添加成功");
        addVisible.value = false;
        getData(pageNum.value); // Refresh the data after adding
      } else {
        ElMessage.error("添加失败");
      }
    })
    .catch(() => {
      ElMessage.error("添加失败，请稍后再试");
    });
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
  padding: 10px 0;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.search-container .el-input {
  margin-right: 10px;
}

.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add {
  /* Remove the previous right positioning */
}
</style>
