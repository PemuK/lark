<template>
  <div>
    <!-- Add Building Button -->
    <div class="box">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="请输入建筑名称以搜索"
          prefix-icon="el-icon-search"
          clearable
          style="width: 300px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
        <el-button type="primary" @click="reset"> 重置 </el-button>
      </div>

      <!-- 添加按钮 -->
      <div style="text-align: right; margin-bottom: 10px">
        <el-button type="primary" @click="handleAdd">添加建筑</el-button>
      </div>
    </div>

    <!-- Building Table -->
    <el-table :data="buildingData" style="width: 100%" stripe border>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
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

    <!-- Pagination -->
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

    <!-- Add/Edit Dialog -->
    <el-dialog title="建筑管理" v-model="dialogVisible" width="30%">
      <el-form label-width="90px" label-position="right">
        <el-form-item label="建筑名称">
          <el-input
            v-model="buildingForm.buildingName"
            placeholder="请输入建筑名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="buildingForm.type" placeholder="请选择类型">
            <el-option label="办公楼" :value="0"></el-option>
            <el-option label="职工楼" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="校区">
          <el-select v-model="buildingForm.campus" placeholder="请选择校区">
            <el-option label="西校区" :value="0"></el-option>
            <el-option label="东校区" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBuilding">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="建筑管理" v-model="addVisible" width="30%">
      <el-form label-width="90px" label-position="right">
        <el-form-item label="建筑名称">
          <el-input
            v-model="buildingForm.buildingName"
            placeholder="请输入建筑名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="buildingForm.type" placeholder="请选择类型">
            <el-option label="办公楼" :value="0"></el-option>
            <el-option label="职工楼" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="校区">
          <el-select v-model="buildingForm.campus" placeholder="请选择校区">
            <el-option label="西校区" :value="0"></el-option>
            <el-option label="东校区" :value="1"></el-option>
          </el-select>
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
import { ElMessage } from "element-plus";
import {
  pageByStatusApi,
  addBuildingApi,
  updateBuildingApi,
  updateBuildingStatusApi,
  pageByNameApi,
} from "../api/building";

// Pagination settings
const pageSize = 14;
const pageNum = ref(1);
const searchType = ref(false);
const total = ref(0);
const searchQuery = ref("");

// Building Data
const buildingData = ref<any[]>([]);

const reset = () => {
  pageNum.value = 1;
  searchType.value = false;
  fetchBuildingData(pageNum.value);
};

// Building Form
const buildingForm = ref({
  id: 0,
  buildingName: "",
  type: 0,
  campus: 0,
  status: 1,
});

// Dialog visibility
const dialogVisible = ref(false);
const addVisible = ref(false);
// Fetch building data on mount
onMounted(() => {
  fetchBuildingData(pageNum.value);
});

// Fetch building list
const fetchBuildingData = (currentPage: number) => {
  pageByStatusApi(currentPage, pageSize, 1).then((res) => {
    if (res.data.code === 200) {
      buildingData.value = res.data.data.list;
      total.value = res.data.data.total; // Update total for pagination
    }
  });
};
const searchBuildingData = (currentPage: number) => {
  pageByNameApi(currentPage, pageSize, searchQuery.value, 1).then((res) => {
    if (res.data.code === 200) {
      buildingData.value = res.data.data.list;
      total.value = res.data.data.total; // Update total for pagination
      ElMessage.success("查询成功");
    }
  });
};

// Handle page change
const handlePageChange = (newPage: number) => {
  pageNum.value = newPage;
  if ((searchType.value = true)) {
    searchBuildingData(newPage);
  } else {
    fetchBuildingData(newPage);
  }
};

// Handle add new building
const handleAdd = () => {
  buildingForm.value = { id: 0, buildingName: "", type: 0, campus: 0, status: 1 };
  addVisible.value = true;
};

// Handle edit building
const handleEdit = (row: any) => {
  buildingForm.value = { ...row };
  dialogVisible.value = true;
};

const handleSearch = async () => {
  pageNum.value = 1;
  searchType.value = true;
  searchBuildingData(pageNum.value);
};

const saveAdd = () => {
  addBuildingApi(
    buildingForm.value.buildingName,
    buildingForm.value.type,
    buildingForm.value.campus
  ).then((res) => {
    if (res.data.code == 200) {
      ElMessage.success("添加成功");
    }
    addVisible.value = false;
    fetchBuildingData(pageNum.value);
  });
};

// Save building (add or update)
const saveBuilding = () => {
  if (buildingForm.value.id) {
    // Update existing building
    updateBuildingApi(
      buildingForm.value.id,
      buildingForm.value.buildingName,
      buildingForm.value.type,
      buildingForm.value.campus
    ).then((res) => {
      if (res.data.code === 200) {
        ElMessage.success("更新成功");
        dialogVisible.value = false;
        fetchBuildingData(pageNum.value);
      } else {
        ElMessage.error("更新失败");
      }
    });
  } else {
    // Add new building
    addBuildingApi(
      buildingForm.value.buildingName,
      buildingForm.value.type,
      buildingForm.value.campus,
      1,
    ).then((res) => {
      if (res.data.code === 200) {
        ElMessage.success("添加成功");
        dialogVisible.value = false;
        fetchBuildingData(pageNum.value);
      } else {
        ElMessage.error("添加失败");
      }
    });
  }
};

// Handle delete building
const handleDelete = (row: any) => {
  updateBuildingStatusApi(row.id, 0).then((res) => {
    if (res.data.code === 200) {
      ElMessage.success("删除成功");
      fetchBuildingData(pageNum.value);
    } else {
      ElMessage.error("删除失败");
    }
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
