<template>
  <div class="common-layout">
    <el-container>
      <el-main class="container">
        <div class="search-wrapper" style="margin-bottom: 20px">
          <!-- 搜索框 -->
          <el-input
            v-model="searchQuery"
            placeholder="请输入姓名以搜索"
            prefix-icon="el-icon-search"
            clearable
            style="width: 300px; margin-right: 10px"
          />
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>

          <el-button type="primary" @click="reset"> 重置 </el-button>
        </div>
        <div class="table-wrapper">
          <el-table border v-loading="tableLoading" :data="data" style="width: 100%">
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="学院/部门" prop="organizationName" />
            <el-table-column label="账号" prop="username" />
            <el-table-column label="权限" prop="permission" />
            <el-table-column label="联系电话" prop="phoneNumber" />
            <el-table-column label="年级" prop="startYear" />

            <el-table-column align="right" width="200px">
              <template #header>
                <el-button size="small" text @click="handleAdd()"> 添加 </el-button>
              </template>
              <template #default="scope" align="center">
                <el-button size="small" text @click="handleEdit(scope.$index, scope.row)">
                  修改
                </el-button>
                <el-button
                  size="small"
                  text
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-container">
          <el-pagination
            v-bind="{
              pageSize: query.pageSize,
              currentPage: query.pageIndex,
              total: pageTotal,
            }"
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </el-main>
    </el-container>
  </div>

  <!-- 编辑弹出框 -->
  <el-dialog title="编辑" v-model="editVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="年级">
        <el-input v-model="form.level"></el-input>
      </el-form-item>
      <el-form-item label="所属部门">
        <select
          id="building"
          class="modify-input"
          v-model="form.organization"
          placeholder="选择所在部门"
        >
          <option value="" disabled selected>选择所在部门</option>
          <!-- 修正拼写错误: organizatoin -> organization -->
          <option
            v-for="organization in organizations"
            :key="organization.id"
            :value="organization.id"
          >
            {{ organization.organizationName }}
          </option>
        </select>
      </el-form-item>

      <el-form-item label="权限">
        <select
          id="building"
          class="modify-input"
          v-model="form.status"
          placeholder="请选择权限"
        >
          <option v-for="item in permiss" :key="item.id" :value="item.id">
            {{ item.premission }}
          </option>
        </select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit()">提交</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog title="添加" v-model="addVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="年级">
        <el-input v-model="form.level"></el-input>
      </el-form-item>
      <el-form-item label="所属部门">
        <select
          id="building"
          class="modify-input"
          v-model="form.organization"
          placeholder="选择所在部门"
        >
          <option value="" disabled selected>选择所在部门</option>
          <!-- 修正拼写错误: organizatoin -> organization -->
          <option
            v-for="organization in organizations"
            :key="organization.id"
            :value="organization.id"
          >
            {{ organization.organizationName }}
          </option>
        </select>
      </el-form-item>

      <el-form-item label="权限">
        <select
          id="building"
          class="modify-input"
          v-model="form.status"
          placeholder="请选择权限"
        >
          <option v-for="item in permiss" :key="item.id" :value="item.id">
            {{ item.premission }}
          </option>
        </select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd()">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";

import { getOrganizationByStatusApi } from "../api/organization";
import {
  getAllUserApi,
  updateUserInfoApi,
  updateUserStateByIdApi,
  addUserApi,
  listUserByNameApi,
} from "../api/user";

import { Search } from "@element-plus/icons-vue";

import { ElMessageBox, ElMessage } from "element-plus";

import MD5 from "crypto-js/md5";

const searchQuery = ref();

export interface UserForm {
  id: number;
  name: string;
  phone: string;
  username: string;
  password: string;
  level: string;
  organization: number;
  status: number;
}

let permiss = ref([
  {
    id: 0,
    premission: "无权限",
  },
  {
    id: 1,
    premission: "维护员",
  },
  {
    id: 2,
    premission: "维护管理员",
  },
  {
    id: 3,
    premission: "超级管理员",
  },
]);

const form = reactive<UserForm>({
  id: 0,
  name: "",
  phone: "",
  username: "",
  password: "",
  level: "",
  organization: 0,
  status: 1,
});
// Define the reset method
const resetForm = () => {
  form.id = 0;
  form.name = "";
  form.phone = "";
  form.username = "";
  form.password = "";
  form.level = "";
  form.organization = 0;
  form.status = 1;
};
const editVisible = ref(false);
const addVisible = ref(false);
const handleEdit = (index: number, row: any) => {
  editVisible.value = true;
  form.id = row.id;
  form.name = row.name;
  form.username = row.username;
  form.password = "";
  form.phone = row.phoneNumber;
  form.level = row.startYear;
  form.organization = row.organizationId;
  form.status = row.status;
};
const handleAdd = () => {
  resetForm();
  addVisible.value = true;
};

const submitAdd = () => {
  const encryptedPassword = MD5(form.password).toString();

  // 处理 level，确保是有效的数字
  const level = parseInt(form.level, 10);
  const validLevel = isNaN(level) ? 0 : level; // 如果 level 无效，设置默认值为 0

  addUserApi(
    form.name,
    form.username,
    encryptedPassword, // 使用加密后的密码
    validLevel, // 使用有效的 level
    form.phone,
    form.organization,
    form.status
  )
    .then((res) => {
      // 处理成功
      if (res.data.code == 200) {
        ElMessage.success("添加成功"); // 显示成功消息
      }
      getData(); // 刷新数据
      resetForm(); // 可选：成功提交后重置表单
      addVisible.value = false; // 隐藏表单
    })
    .catch((error) => {
      // 处理错误
      console.error("Failed to add user:", error);
      ElMessage.error("添加失败"); // 显示失败消息
    });
};

// const resetFrom=()

const odMaintData = ref<any[]>([]);
const categorizedData = ref<{ [key: string]: { [key: number]: any[] } }>({});
const data = ref<any[]>([]);
const organizations = ref<any[]>([]);
const isDialogVisible = ref(false);
const pageTotal = ref(0);
const editUser = ref<any>(null);
const tableLoading = ref(true);
const query = reactive({
  address: "",
  name: "",
  pageIndex: 1,
  pageSize: 14,
});

// 组件挂载时加载数据
onMounted(() => {
  // loadCachedData();
  getData();
});

const handleSearch = async () => {
  query.pageIndex = 1;
  const res = await listUserByNameApi(
    query.pageIndex,
    query.pageSize,
    searchQuery.value,
    1
  ); // 获取状态为1的组织列表
  // 检查是否成功返回数据
  data.value = res.data.data.list; // 更新organizations的值
  pageTotal.value = res.data.data.total;
  ElMessage.success("查询成功");
};

const reset = () => {
  query.pageIndex = 1;
  getData();
};

const getData = () => {
  fetchAllUsers();
  getAllOrganizationInfo();
};

// 从缓存中加载数据
// const loadCachedData = () => {
//   const odMaintDataString = localStorage.getItem("od_maint_p");
//   if (odMaintDataString) {
//     odMaintData.value = JSON.parse(odMaintDataString);
//     categorizeData(odMaintData.value); // 加载缓存数据后进行分类
//   }
// };

const getAllOrganizationInfo = async () => {
  const res = await getOrganizationByStatusApi(1); // 获取状态为1的组织列表
  // 检查是否成功返回数据
  organizations.value = res.data.data; // 更新organizations的值
};
// 获取所有用户数据
const fetchAllUsers = async () => {
  try {
    const res = await getAllUserApi(query.pageIndex, query.pageSize);
    data.value = res.data.data.list;
    console.log(res);
    pageTotal.value = res.data.data.total || 50;
  } finally {
    tableLoading.value = false; // 数据加载完成后隐藏 loading 状态
  }
};

// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  tableLoading.value = true;
  fetchAllUsers(); // 重新获取用户数据
};

// 数据分类函数
const categorizeData = (data: any[]) => {
  const result: { [key: string]: { [key: number]: any[] } } = {};

  data.forEach((item) => {
    const org = item.organizationName; // 学院
    const year = item.startYear; // 年级

    if (!result[org]) {
      result[org] = {}; // 初始化学院分类
    }

    if (!result[org][year]) {
      result[org][year] = []; // 初始化年级分类
    }

    result[org][year].push(item);
  });

  categorizedData.value = result;
};

const openEditDialog = (user: any) => {
  editUser.value = { ...user }; // 克隆用户数据到编辑对象
  isDialogVisible.value = true; // 显示弹窗
};

const submitEdit = async () => {
  const encryptedPassword = MD5(form.password).toString();
  try {
    const res = await updateUserInfoApi(
      form.id,
      form.name,
      form.username,
      encryptedPassword,
      form.phone,
      Number(form.level),
      form.organization,
      form.status
    );
    // await updateUserApi(editUser.value);
    if (res.data.code == 200) {
      ElMessage.success("用户信息已更新");
    }
    getData();
    resetForm();
    editVisible.value = false; // 关闭弹窗
  } catch (error) {}
};

// 删除操作
const handleDelete = (index: number, id: any) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
  })
    .then(() => {
      // 确保 updateMaintStateApi 返回的是一个 Promise
      updateUserStateByIdApi(id, 0).then((res) => {
        console.log(res);
        ElMessage.success("删除成功");
        // 从 tableData 中删除项
        data.value.splice(index, 1);
        getData();
      });
    })
    .catch(() => {
      // 处理用户取消操作
    });
};
</script>

<style scoped>
.modify-input {
  width: 100%;
  height: 35px;
  border-radius: 0.2rem;
}
.el-container {
  display: flex;
  gap: 10px; /* 调整间距 */
}

.el-aside {
  height: 360px; /* 使侧边栏高度自适应内容 */
}

.el-main {
  display: flex;
  flex-direction: column;
  height: 790px;
  flex: 1; /* 使主内容区域自适应填充剩余空间 */
  position: relative;
}

.table-wrapper {
  flex: 1; /* 使表格区域自适应填充剩余空间 */
  overflow: auto; /* 如果表格内容超出，则显示滚动条 */
}

.pagination-container {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
}

.table {
  font-size: 14px;
}
.modify-input {
  width: 100%;
  height: 35px;
  border-radius: 0.2rem;
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
</style>
