<template>
  <el-card id="card">
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
      <!-- Tab 2: 维护类型 -->
      <el-tab-pane label="维护类型" name="first">
        <MaintType></MaintType>
      </el-tab-pane>

      <!-- Tab 3: 地址/学院信息 -->
      <el-tab-pane label="学院信息" name="second">
        <Organization></Organization>
      </el-tab-pane>

      <el-tab-pane label="建筑信息" name="third">
        <Building></Building>
      </el-tab-pane>

      <!-- Tab 4: DNS -->
      <!-- <el-tab-pane label="DNS" name="fouth">
        <el-table :data="dnsData" style="width: 100%">
          <el-table-column prop="domain" label="域名"></el-table-column>
          <el-table-column prop="ip" label="IP 地址"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
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
      </el-tab-pane> -->
    </el-tabs>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type { TabsPaneContext } from "element-plus";
import MaintType from "../components/MaintType.vue";
import Organization from "../components/Organization.vue";
import Building from "../components/Building.vue";
import { listMaintTypeByStatusApi } from "../api/maint";
import { listUserByStatusAndStateApi } from "../api/user";

// Tab 3: 地址/学院信息 data

// Tab 4: DNS data
const dnsData = ref([
  { domain: "example.com", ip: "192.168.1.1", status: "正常" },
  { domain: "test.com", ip: "192.168.1.2", status: "异常" },
  { domain: "mywebsite.com", ip: "192.168.1.3", status: "正常" },
]);

const activeName = ref("first");
watch(activeName, (newValue, oldValue) => {
  localStorage.setItem("activeTab", newValue); // Store in localStorage whenever activeName changes
});
onMounted(() => {
  const storedTab = localStorage.getItem("activeTab");
  if (storedTab) {
    activeName.value = storedTab; // Set the active tab to the value from localStorage
  }
});


const handleClick = (tab: TabsPaneContext, event: Event) => {
};
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 24px;
  background-color: #f9fafc;
}

#card {
  height: 86.9vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-table {
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}
</style>
